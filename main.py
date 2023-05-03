from flask import Flask, render_template, request, redirect
import sqlite3
import json
import random

app = Flask(__name__)


URL = "localhost:5000"


def createTable():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = "CREATE TABLE IF NOT EXISTS songs ("\
        "id TEXT NOT NULL PRIMARY KEY, "\
        "name TEXT , "\
        "artist TEXT , "\
        "albumID TEXT , "\
        "duration NUMBER , "\
        "previewUrl TEXT , "\
        "liked NUMBER  "\
        ")"
    cur.execute(cmd)

    cmd = "CREATE TABLE IF NOT EXISTS albums ("\
        "id TEXT NOT NULL PRIMARY KEY, "\
        "name TEXT , "\
        "artist TEXT , "\
        "img TEXT , "\
        "release TEXT , "\
        "numSongs NUMBER  "\
        ")"
    cur.execute(cmd)

    cmd = "CREATE TABLE IF NOT EXISTS artists ("\
        "id TEXT NOT NULL PRIMARY KEY, "\
        "name TEXT , "\
        "img TEXT , "\
        "followers NUMBER , "\
        "verified NUMBER  "\
        ")"
    cur.execute(cmd)

    myConn.close()

@app.route('/')
def index():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()
    
    cmd = "SELECT * FROM songs;"
    cur.execute(cmd)
    songsdetails = cur.fetchall()
    random.shuffle(songsdetails)
    songs = []
    for song in songsdetails:
        sng = {}
        sng['name'] = song[1]
        sng['artist'] = song[2]
        sng['img'] = getAlbumCoverImg(song[3])
        if len(sng['name']) <=15 and len(sng['artist']) <=15:
            songs.append(sng)
    
    
    cmd = "SELECT * FROM albums;"
    cur.execute(cmd)
    albumsdetails = cur.fetchall()
    random.shuffle(albumsdetails)
    albums = []
    for album in albumsdetails:
        alb = {}
        alb['id'] = album[0]
        alb['name'] = album[1]
        alb['artist'] = getArtistName(album[2])
        alb['img'] = album[3]
        alb['year'] = album[4].split('-')[0]
        alb['numSongs'] = album[5]
        if len(alb['name']) <= 15:
            albums.append(alb)
    
    cmd = "SELECT * FROM artists;"
    cur.execute(cmd)
    artistsdetails = cur.fetchall()
    random.shuffle(artistsdetails)
    artists = []
    for artist in artistsdetails:
        art = {}
        art['id'] = artist[0]
        art['name'] = artist[1]
        art['img'] = artist[2]
        try:
            art['followers'] = int(artist[3]) % 1000
        except:
            art['followers'] = 0
        art['verified'] = artist[4]
        if art['followers'] != 0 and len(art['name']) <= 15:
            artists.append(art)
    
    
    myConn.close()
    
    return render_template('index.html', songs=songs[:5], albums=albums[:5], artists=artists[:5])
