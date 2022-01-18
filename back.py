from cProfile import label
from getpass import getuser
from os import path, terminal_size
import sqlite3
from sqlite3.dbapi2 import Error, Timestamp, enable_shared_cache
from flask.testing import FlaskClient
import pandas as pd
import time
import json
import sql_tools
from sql_tools import query_exec, regular_LIKE_str_query
import parse_tools
from parse_tools import query_constraint_title_normalize
import uuid

GENRES_REG = None
with open("bd/genresReg.txt", "r") as reg:
    GENRES_REG = set(reg.read().split(','))
def lastpos(genre: str):
    try:
        res = query_exec(
            f"""
            SELECT position FROM genres_count WHERE genre_name = '{genre}'
            """
        )
        if res:
            return res[0][0]
        return 0
    except Error as err:
        print(err)
        return False
def getuserid(username):
    try: 
        res = query_exec(
            f"""
            SELECT userId FROM users WHERE username = '{username}'
            """
        )
        return res[0][0]
    except Error as err:
        print(err)
        return False
#ДОБАВИТЬ ПЕСНЮ
def add_song(name: str, artist: str, genres: list) -> bool: #доступно только администрации
    #prs = lambda x: parse_tools.query_contraint_if_not_null_to_list(parse_tools.query_constraint_from_none_to_null(x))
    genres = parse_tools.genresNormalize(genres)
    setGenres = set(genres)
    #Добавляем песню
    try:#{(',').join(setGenres).title()}'
        query_exec(
            f"""
            INSERT INTO songs(name,artist) VALUES ('{name}','{artist}');
            """
        )
    except Error as err:
        print(err)
        return False
    #Добавляем жанры
    ind = query_exec( #Id добавленной песни
        f"""
        SELECT songid FROM songs WHERE name = '{name}' AND artist = '{artist}' 
        """
    ).pop()[0]
    if genres != 'NULL':
        try:
            for i in genres:
                pos = lastpos(i)
                query_exec(
                    f"""
                    INSERT INTO genres VALUES ({ind},{pos+1},'{i}')
                    """
                )
        except Error as err:
            print(err)
            return False
    reg = open("bd/genresReg.txt", "a")
    for i in setGenres:
        if i not in GENRES_REG:
            GENRES_REG.add(i)
            reg.write(',' + i)
    reg.close()
    return True
def delete_song(songId) -> bool:
    try:
        query_exec(
            f"""
            DELETE FROM songs WHERE songId = {songId};
            """
        )
        return True
    except Error as err:
        print(err)
        return False

#ПОЛЬЗОВАТЕЛЬ
def registration_user(username: str, password: str):
    try:
        query_exec(
            f"""
            INSERT INTO users(username, password) VALUES ('{username}','{password}');
            """
        )
        return True
    except Error as err:
        return False     
def delete_user(username: str):
    try:
        query_exec(
            f"""
            DELETE FROM users WHERE username = '{username}';
            """
        )
        return True
    except Error as err:
        return False
def authorize_user(username: str, password: str) -> bool:
    try:
        res = query_exec(
            f"""
            SELECT * FROM users WHERE username = '{username}' AND password = '{password}'
            """
        )
        return len(res) != 0
    except Error as err:
        return False
def isAdmin(username: str) -> bool:
    try:
        ind = getuserid(username)
        res = query_exec(
            f"""
            SELECT * FROM admins WHERE userId = {ind}
            """
        )
        return len(res) != 0
    except Error as err:
        return False
def addAdmin(username: str):
    try:
        ind = getuserid(username)
        query_exec(
            f"""
            INSERT INTO admins VALUES ({ind});
            """
        )
        return True
    except:
        return False 

#ПОИСК ПЕСЕН 
def get_filtred_songs(name: str = None, artist: str = None, genres: list = None, userid: int = None, offset: int = 0, limit: int = 20) -> json: # where ind > offset(0) top limit
    print("go")
    try:
        prs = lambda x: parse_tools.query_contraint_if_not_null_to_list(parse_tools.query_constraint_from_none_to_null(x))
        name = query_constraint_title_normalize(name, True)
        artist = query_constraint_title_normalize(artist, True)
        genres = parse_tools.genresNormalize(genres) #...
        userid = parse_tools.query_constraint_from_none_to_null(userid)
        res = query_exec(
            f"""
            SELECT songs.songId
            FROM songs
            LEFT JOIN genres ON genres.songId = songs.songId
            LEFT JOIN users_favorites u_f ON u_f.userId = {userid} 
            WHERE 
                name LIKE '%' || COALESCE({name}, '') || '%' AND
                artist LIKE '%' || COALESCE({artist}, '') || '%' AND 
                {regular_LIKE_str_query(genres, 'genre_name')} AND
                {'u_f.songId = songs.songId' if userid != 'NULL' else 'TRUE'}
            GROUP BY songs.songId
            LIMIT {limit} OFFSET {offset}
            """
        ) 
        res = [str(i[0]) for i in res]
        return get_full_info_songs_by_id(res)
    except Error as err:
        print(err)
        return False

#ДОБАВИТЬ В ИЗБРАННОЕ
def add_song_to_favorite(userId, songId, label: str) -> bool:
    try:
        label = bool(int(label))
        if label:
            query_exec(
                f"""
                INSERT INTO users_favorites(userId,songId) VALUES ({userId}, {songId})
                """
            )
        else:
            query_exec(
                f"""
                DELETE FROM users_favorites WHERE userId = {userId} AND songId = {songId}
                """
            )
        return True
    except Error as err:
        print(err)
        return False

def get_user_id(username: str):
    try: 
        userId= query_exec(
            f"""
            SELECT userId FROM users WHERE username = '{username}'
            """
        )
        return userId[0][0]
    except:
        return False
def get_allUsers(offset: int = 0, limit: int = 20):
    offset = int(offset)
    res = query_exec(
        f"""
            SELECT userId,username,password FROM users 
            ORDER BY 1 
            LIMIT {limit} OFFSET {offset};
        """
    )
    jsres = []
    for i in res:
        jsres.append(
            {
                'userId' : i[0],
                'username' : i[1],
                'password' : i[2]
            } 
        )
    return json.dumps(jsres)
def get_user_favorites(userId):
    try:
        res = query_exec(
            f"""
            SELECT movieId FROM users_favorites WHERE userId = {userId}
            ORDER BY timestamp DESC
            """
        )
        res = [i[0] for i in res]
        return res
        #get_full_info_movies_by_id(res,userId)
    except Error as err:
        print(err)
        return False
def genres_help(gen: str, limit: int):
    limit = int(limit)
    f = open("bd/genresReg.txt", "r")
    genrs = (f.read()).split(',')
    res = []
    j = 0
    for i in genrs:
        if j >= limit: break
        if gen in i:
            res.append(i)
            j += 1

    return json.dumps({"genres" : res})

#ВЫВОД ИНФОРМАЦИИ
def get_columInfo_by_songid(songId: list, table:str, column: str, addCond: str = 'TRUE'): #только 1 столбец
    if type(songId) != list:
        songId = [songId]
    res = query_exec(
        f"""
        SELECT {column} FROM {table} WHERE {sql_tools.regular_IN_str_query(songId, 'songId')} AND {addCond}
        """
    )
    return [i[0] for i in res]
def get_full_info_songs_by_id(songId: list, userId: int = None) -> json:
    if type(songId) != list:
        songId = [songId]
    f = lambda x: get_columInfo_by_songid(songId,'songs_info', x)
    name = f('name')
    artist = f('artist')
    genres = f('genres')

    res = []
    for i in range(len(songId)):
        res.append(
            {
                'songId' : songId[i],
                'name' : name[i],
                'artist' : artist[i],
                'genres' : genres[i],
            }
        )
    return json.dumps(res)
