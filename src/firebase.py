'''
This program runs 24/7 (hosted on heroku) and does the following:
 - Checks "joinable_games" and converts the games to "current_games" after 24 hours. Doesn't add games that have no other players other than the creatorx.difference(y)
 - Checks "current_games" and convrets the games to "previous_games after their 2 weeks. This ends the game session. It also adds the game_id to each user's profile and updates the win count for the user who took first place
 - Updates all coin prices every 24 hours. Typically at 7 PM CST. Limited to 300 coins.
 - Updates user profiles & stats accordingly when a game session successfully ends.
'''
import threading
import firebase_admin
from google.cloud.firestore_v1 import Increment, ArrayRemove, ArrayUnion
from firebase_admin import credentials, firestore
import time
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
from time import sleep


cred = credentials.Certificate("./playfantasymarket-firebase-adminsdk-pj4yp-de3ead07ef.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


#update coin prices every 24 hours
currencies_to_update = list(db.collection(u'coin_prices').get())
didCoinsUpdate = False
for currency in currencies_to_update:
    currency_name = currency.id
    currency_info = currency.to_dict()
    if(int(time.time() * 1000) > currency_info["updatedAt"] + (86400000-10000)):
        didCoinsUpdate = True
        print("updated", currency_name)
        
        url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
        parameters = {
            'slug': currency_name
        }
        headers = {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': "1d62807d-b858-4715-9a04-5fdfb1414cb0"
        }
        session = Session()
        session.headers.update(headers)
        try:
            response = session.get(url, params=parameters)
            data = json.loads(response.text)
            currency_data_keys = list(data['data'].keys())
            current_price = round(data['data'][currency_data_keys[0]]['quote']['USD']['price'], 2)
            print(current_price)
            db.collection(u'coin_prices').document(currency_name).set({
                "updatedAt": int(time.time() * 1000),
                "value": current_price
            })
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            print(e)


# Define definition for merge which basically takes two arrays i.e., the left and right part
def merge(left, right, game_info):
    result = []  # final result array, that is an empty array
    #create two indices and initialize with 0
    i, j = 0, 0
    # Till this condition is true, keep on appending elements into resultant array
    while i<len(left) and j<len(right):
        if game_info[left[i]]["total"] <= game_info[right[j]]["total"] :
            result.append(left[i]) #append ith element of left into resultant array
            i+=1
        else:
            result.append(right[j])  #append jth element of right into resultant array
            j+=1
    # it basically specifies that if any element is remaining in the left array from -
    # ith to the last index so that it should appended into the resultant array. And similar -
    # to the right array.
    result += left[i:]
    result += right[j:]
    return result
 
# Definition for merge sort
# this takes an input list
def mergesort(lst, game_info):
    if(len(lst)<= 1): # this means that the list is already sorted.
        return lst
    mid = int(len(lst)/2)
    # left array will be mergesort applied over the list from starting index 
    # till the mid index
    left = mergesort(lst[:mid], game_info)
    # right array will be mergesort applied recursively over the list from mid index
    # till the last index 
    right = mergesort(lst[mid:], game_info)
    return merge(left, right, game_info)  # finally return merge over left and right

#update leaderboard for each current game AFTER player totals have been updated (which is updated AFTER coin prices have been updated)
def updateLeaderboard():
    current_games = list(db.collection(u'current_games').get())
    for game in current_games:
        players = list(game.to_dict()["players"])
        game_id = game.id
        game_info = game.to_dict()
        new_ranking = mergesort(players, game_info)
        new_ranking.reverse()
        print(new_ranking)
        db.collection(u'current_games').document(game_id).update({
            "players": new_ranking
        })
    
# Merge Sort is used to sort the leaderboard. List is reversed to get rankings from highest to lowest.
# Merge Sort - Runtime: O(nlog(n)) Space: O(nlog(n))
# update leaderboards for each currently ongoing game if coin prices have been updated (every 24 hours)
# or statement for backup incase first check fails
bitcoin_info = currencies_to_update[0].to_dict()
current_games = list(db.collection(u'current_games').get())
if(didCoinsUpdate or int(time.time() * 1000) > bitcoin_info["updatedAt"] + (86400000 - 10000)):
    currencies_price_updated = db.collection(u'coin_prices').get()
    new_currency_prices = {}
    #store new currency prices
    for currency in currencies_price_updated:
        new_currency_prices[currency.id] = currency.to_dict()["value"]
    #loop each current game
    for game in current_games:
        players = list(game.to_dict()["players"])
        game_id = game.id
        game_info = game.to_dict()
        #loop each player in each game
        for player in players:
            player_portfolio = game_info[player]
            total = 0
            #loop each player's portfolio
            for currency in player_portfolio:
                if currency == "canEdit" or currency == "total":
                    continue
                elif currency == "cash":
                    total += player_portfolio["cash"]
                else:
                    total += round(player_portfolio[currency] * new_currency_prices[currency], 2)
            #update player's portfolio
            print("old: ", player_portfolio["total"], "new: ", total)
            player_portfolio["total"] = total
            db.collection(u'current_games').document(game_id).update({
                player: player_portfolio
            })

    updateLeaderboard()
    didCoinsUpdate = False


# convert joinable games to current games (starting game session)
joinable_games = list(db.collection(u'joinable_games').get())
for joinable_game in joinable_games:
    start_date = joinable_game.to_dict()["start_date"]
    num_of_players = len(joinable_game.to_dict()["players"])
    game_id = joinable_game.id
    game_info = joinable_game.to_dict()
    #remove from joinable and add to current
    if int(time.time() * 1000) > start_date and num_of_players > 1:
        db.collection(u'joinable_games').document(game_id).delete()
        db.collection(u'current_games').document(game_id).set(game_info)
        print(game_id, 'moved to current games')
    elif int(time.time() * 1000) > start_date and num_of_players <= 1:
        db.collection(u'joinable_games').document(game_id).delete()
        db.collection(u'users').document(game_info["creator"]).update({
            "current_games": ArrayRemove(game_id)
        })
        print("sorry, not enough players")
    else:
        print("game session hasn't started")
      

# convert current games to previous games (ending game session)
for current_game in current_games:
    end_date = current_game.to_dict()["end_date"]
    game_id = current_game.id
    game_info = current_game.to_dict()
    #remove from current and add to previous
    if int(time.time() * 1000) > end_date:
        players = game_info["players"]
        db.collection(u'current_games').document(game_id).delete()
        db.collection(u'previous_games').document(game_id).set(game_info)
        
        first_place_total = -100000
        first_place_user = ""
        for player in players:
            # add game_id to each users previous game profile & remove it from current games
            db.collection(u'users').document(player).update({
                "previous_games": ArrayUnion(game_id),
                "current_games": ArrayRemove(game_id)
            })
            if game_info[player]["total"] > first_place_total:
                first_place_total = game_info[player]["total"]
                first_place_user = player
        
        db.collection(u'users').document(first_place_user).update({
            "games_won": ArrayUnion( game_id ),
            "wins": Increment(1)
        })        
        print(game_id, 'moved to previous games')
    else: 
        print("game session hasn't ended")

db.collection(u"script_counter").document("count").update({
    "count": Increment(1)
})

# stop for 5 minutes
sleep(300)