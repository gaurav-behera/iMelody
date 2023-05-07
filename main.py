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

def getLikedSongs():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = "SELECT * FROM songs WHERE liked = 1"
    cur.execute(cmd)
    rows = cur.fetchall()
    myConn.close()

    liked = []
    for row in rows:
        liked.append(row[0])
    return liked


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


@app.route('/like', methods=['POST'])
def like():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    songID = request.args['songID']
    like = request.args['like']
    print(songID, like)

    try:
        if like == '1':
            cmd = f"UPDATE songs SET liked = 1 WHERE id = \"{songID}\""

        elif like == '0':
            cmd = f"UPDATE songs SET liked = 0 WHERE id = \"{songID}\""

        cur.execute(cmd)
        myConn.commit()
        ret = {'status': 'success', 'message': f'{songID} unliked'}
        return ret

    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            ret = {'status': 'failed', 'message': f'Song already liked\n{songID}'}
        else:
            ret = {'status': 'failed', 'message': f'{e}'}
        return ret


@app.route('/artists', methods=['GET'])
def artists():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = "SELECT * FROM artists"
    cur.execute(cmd)
    artists = cur.fetchall()
    myConn.close()

    arts = []
    for artist in artists:
        art = {}
        art['id'] = artist[0]
        art['name'] = artist[1]
        art['img'] = artist[2]
        try:
            art['followers'] = int(artist[3]) % 1000
        except:
            art['followers'] = 0
        art['verified'] = artist[4]
        arts.append(art)
    return render_template('artists.html', artists=arts)


@app.route('/artist/<artID>', methods=['GET'])
def artist(artID):
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM artists WHERE id  = \"{artID}\""
    cur.execute(cmd)
    artist = cur.fetchall()

    if len(artist) != 0:
        art = {}
        art['id'] = artist[0][0]
        art['name'] = artist[0][1]
        art['img'] = artist[0][2]
        art['followers'] = int(artist[0][3]) % 1000
        art['verified'] = artist[0][4]
        art['albums'] = []

        cmd = f"SELECT * FROM albums WHERE artist  = \"{artID}\""
        cur.execute(cmd)
        albums = cur.fetchall()

        for album in albums:
            alb = {}
            alb['id'] = album[0]
            alb['name'] = album[1]
            alb['img'] = album[3]
            alb['year'] = album[4].split('-')[0]
            alb['artist'] = getArtistName(album[0][2])
            alb['numSongs'] = album[5]
            alb['url'] = URL + "/albums/" + alb['id']
            art['albums'].append(alb)

        return render_template('artist.html', artist=art)
    return render_template('artist.html', artist=None)


def calcDuration(duration):
    secs = int(duration) // 1000
    mins = secs // 60
    hours = mins // 60
    mins = mins % 60
    secs = secs % 60
    durStr = ""
    if hours > 1:
        durStr += (str(hours)+"hrs ")
    elif hours == 1:
        durStr += (str(hours)+"hr ")
    if mins > 1:
        durStr += (str(mins)+"mins ")
    elif mins == 1:
        durStr += (str(mins)+"min ")
    if secs > 1:
        durStr += (str(secs)+"secs ")
    elif secs == 1:
        durStr += (str(secs)+"sec ")
    return durStr


def getArtistName(artID):
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM artists WHERE id  = \"{artID}\""
    cur.execute(cmd)
    artist = cur.fetchall()

    if len(artist) != 0:
        return artist[0][1]
    return ""


def getArtistCoverImg(artID):
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM artists WHERE id  = \"{artID}\""
    cur.execute(cmd)
    artist = cur.fetchall()

    if len(artist) != 0:
        return artist[0][2]

    return "static/assets/artist.png"


def getAlbumCoverImg(albID):
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM albums WHERE id  = \"{albID}\""
    cur.execute(cmd)
    album = cur.fetchall()

    if len(album) != 0:
        return album[0][3]

    return "static/assets/artist.png"


@app.route('/album/<albID>', methods=['GET'])
def album(albID):
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM albums WHERE id  = \"{albID}\""
    cur.execute(cmd)
    album = cur.fetchall()

    if len(album) != 0:
        alb = {}
        alb['id'] = album[0][0]
        alb['name'] = album[0][1]
        alb['artist'] = getArtistName(album[0][2])
        alb['img'] = album[0][3]
        alb['year'] = album[0][4]
        alb['numSongs'] = album[0][5]

        liked = getLikedSongs()

        totDur = 0

        cmd = f"SELECT * FROM songs WHERE albumID = \"{albID}\""
        cur.execute(cmd)
        songs = cur.fetchall()

        alb['songs'] = []

        for song in songs:
            sng = {}
            sng['id'] = song[0]
            sng['name'] = song[1]
            sng['artist'] = song[2]
            sng['duration'] = calcDuration(song[4]).replace("mins", "m")\
                .replace("secs", "s").replace("sec", "s").replace("min", "m")
            alb['songs'].append(sng)
            if song[0] in liked:
                sng['liked'] = 1
            else:
                sng['liked'] = 0
            totDur += int(song[4])

        alb['duration'] = calcDuration(totDur)

        return render_template('album.html', album=alb)

    return render_template('album.html', album=None)


@app.route('/liked', methods=['GET'])
def liked():
    myConn = sqlite3.connect('iMelody.db')
    cur = myConn.cursor()

    cmd = f"SELECT * FROM songs WHERE liked = 1"
    cur.execute(cmd)
    songs = cur.fetchall()

    sngList = []
    for song in songs:
        sng = {}
        sng['id'] = song[0]
        sng['name'] = song[1]
        sng['artist'] = song[2]
        sng['duration'] = calcDuration(song[4]).replace("mins", "m")\
            .replace("secs", "s").replace("sec", "s").replace("min", "m")
        sng['liked'] = song[6]
        sng['img'] = getAlbumCoverImg(song[3])
        sngList.append(sng)

    return render_template('liked.html', liked=sngList)


@app.route('/featured', methods=['GET'])
def featuredArtist():
    url = getArtistCoverImg("5Pwc4xIPtQLFEnJriah9YJ")
    print(url)
    return render_template('featured.html', img=url)


@app.route('/search', methods=['GET'])
def search():
    return render_template('search.html')


@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')


@app.route('/tnc', methods=['GET'])
def tnc():
    return render_template('tnc.html')


@app.route('/privacy', methods=['GET'])
def privacy():
    return render_template('privacy.html')


@app.route('/cookie', methods=['GET'])
def cookie():
    return render_template('cookie.html')


@app.route('/sitemap', methods=['GET'])
def sitemap():
    return render_template('sitemap.html')


if __name__ == '__main__':
    createTable()
    app.run(debug=True)
