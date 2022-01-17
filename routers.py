import json
from re import M
from flask.ctx import after_this_request
from flask.typing import ResponseReturnValue
import back
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app
)
OK = json.dumps({
    'message' : 'success'
})
ERR = json.dumps({
    'message' : 'bigBlackCock'
})

def doF(bol):
    if bol: return OK
    return ERR
def userId(username):
    return back.get_user_id(username)

@app.route('/song/add')
def addSong():
    r = request.args
    return doF(back.add_song(
        r['name'],
        r['artist'],
        r['genres']))
@app.route('/song/getFiltred')
def getFiltredSongs():
    r = request.args
    print(r['genres'])
    return back.get_filtred_songs(
        r['name'],
        r['artist'],
        r['genres'],
        r['userid'],
        r['offset'],
        r['limit']
    )
@app.route('/user/reg')
def regUser():
    r = request.args
    return doF(back.registration_user(
        r['username'],
        r['password']
    ))
@app.route('/user/aut')
def autUser():
    r = request.args
    if back.authorize_user(r['username'],r['password']):
        isA = back.isAdmin(r['username'])
        return json.dumps({
            'message' : 'success', 
            'isAdmin' : str.lower(f'{isA}')
        })
    else:
        return ERR
@app.route('/user/getFavs')
def getUserFavs():
    r = request.args
    usId = userId(r['username'])

    return str(back.get_user_favorites(usId))
@app.route('/admin/deleteSong')
def deleteSong():
    r = request.args
    return doF(back.delete_song(r['songId']))
@app.route('/admin/deleteUser')
def delUser():
    r = request.args
    usId = userId(r['username'])
    return doF(back.delete_user(
        usId
    ))
@app.route('/admin/getAllUsers')
def getAllUsers():
    r = request.args

    return back.get_allUsers(
        r['offset'],
        r['limit']
    )
@app.route('/admin/giveAdminRoot')
def giveAdminRoot():
    r = request.args
    return doF(back.addAdmin(
        r['username']
    ))