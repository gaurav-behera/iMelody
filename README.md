[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/uO3FBJhb)

## Introduction

At iMelody, we are passionate about music and committed to helping you find the perfect music that matches your taste. So, what are you waiting for? Start exploring and let us take you on a musical journey like no other.

## Index

- [Introduction](#introduction)
- [Index](#index)
- [About](#about)
- [Usage](#usage)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [File Structure](#file-structure)
- [Authors](#authors)

## About

iMelody is designed to allow you to discover new songs and artists through our curated playlists, user-generated recommendations, and trending charts. It also allows you to search for your favourite songs and preview them. The website also gives you information about the featured artist of the week, a countdown to their next song release along with ratings and reviews about the artist.

## Usage

To use iMelody, simply navigate to our homepage and begin exploring our database. Here are a few additional tips to help you get started:
- The homepage has featured songs, albums, and artists based on the top charts, which you can browse through to discover new music. The iMelody logo in the navigation bar can be used to visit the homepage from any other webpage.
- The navigation bar present on every page allows you to quickly search for songs, and view artists.
- The search page can be used to browse through a massive database of songs and preview them.
- The artists' section on the navigation bar allows you to browse through a list of top-trending artists and view their albums and songs.
- Clicking on any album shows details about the album, including all the songs along with their duration, the year of release, and the total duration of the album.
- There is an option to like songs and every liked song is added to the liked songs playlist which can be viewed from the navigation bar.
- Clicking on any artist shows the top albums of the artist. You can view more details about the albums by clicking on any artist.
- The About section in the navigation bar contains details about the contents and usage of the website, along with details about the team who worked on iMelody.
- The featured artist section gives information about the artist featured for the present week. It also gives details to their next song release as well as a rating/review system to add your own review or view reviews of others.
- The sitemap shows a brief overview of the layout of the entire website, the sites present, and the relationships between them.

### Prerequisites
A `python 3.9` or newer environment with `flask` and `sqlite3` installed.

Or alternatively run this command in a python environment.
```
pip install -r requirements.txt
```

### Installation

1. Clone the repository using the command:
```
git clone https://github.com/CS6-201-ISS-S23/project-is-s.git
```
2. Run `main.py` from the root directory
```
python main.py
```

### File Structure

```
.
├── ASSUMPTIONS.md
├── README.md
├── iMelody.db
├── main.py
├── static
│   ├── artist_banner
│   │   ├── 06HL4z0CvFAxyc27GXpf02.png
│   │   ├── 1Xyo4u8uXC1ZmMpatF05PJ.png
│   │   ├── 1dVygo6tRFXC8CSWURQJq2.png
│   │   ├── 1vCWHaC5f2uS3yhpwWbIA6.png
│   │   ├── 4IKVDbCSBTxBeAsMKjAuTs.png
│   │   ├── 4gzpq5DPGxSnKTe4SA8HAU.png
│   │   ├── 4zCH9qm4R2DADamUHMCa6O.png
│   │   ├── 53XhwfbYqKCa1cC15pYq2q.png
│   │   ├── 5Pwc4xIPtQLFEnJriah9YJ.png
│   │   ├── 69GGBxA162lTqCwzJG5jLp.png
│   │   └── 7zFBW2JxM4bgTTKxCRcS8Q.png
│   ├── assets
│   │   ├── about-bg.jpg
│   │   ├── arrow.svg
│   │   ├── background.jpeg
│   │   ├── filter-icon.png
│   │   ├── heart-empty.svg
│   │   ├── heart-full.svg
│   │   ├── heart.svg
│   │   ├── liked.svg
│   │   ├── logo.png
│   │   ├── logo2.png
│   │   ├── logout.svg
│   │   ├── manage-account.svg
│   │   ├── next-icon.svg
│   │   ├── oops.png
│   │   ├── pause-icon.svg
│   │   ├── pfp-amey.jpeg
│   │   ├── pfp-gaurav.jpeg
│   │   ├── play-icon.svg
│   │   ├── prev-icon.svg
│   │   ├── search.svg
│   │   ├── social-fb-white.png
│   │   ├── social-fb.png
│   │   ├── social-gh.png
│   │   ├── social-ig-white.png
│   │   ├── social-ig.png
│   │   ├── social-lk.png
│   │   ├── social-tw-white.png
│   │   ├── star-empty.svg
│   │   ├── star-full.svg
│   │   ├── star-half.svg
│   │   ├── user.jpg
│   │   ├── verified.svg
│   │   └── volume-icon.svg
│   ├── css
│   │   ├── album.css
│   │   ├── artist.css
│   │   ├── artists.css
│   │   ├── featured.css
│   │   ├── footer.css
│   │   ├── index.css
│   │   ├── navbar.css
│   │   └── search.css
│   └── js
│       ├── album.js
│       ├── countdown.js
│       ├── review.js
│       ├── search.js
│       └── typing-effect.js
└── templates
    ├── about.html
    ├── album.html
    ├── artist.html
    ├── artists.html
    ├── cookie.html
    ├── featured.html
    ├── index.html
    ├── liked.html
    ├── privacy.html
    ├── search.html
    ├── sitemap.html
    └── tnc.html
```

| No | File/Folder Name | Details
|----|------------|-------|
| 1| main.py | Flask app for the webpage
| 2| index.html | Homepage of the website
| 3| search.html | Webpage to search for songs
| 4| liked.html | Webpage to show liked songs
| 5| featured.html | Webpage containing details about the featured artist
| 6| artists.html | Webpage containing a list of all the artists
| 7| artist.html | Webpage template for albums of each artist
| 8| album.html | Webpage template songs of each album
| 9| about.html | Information about the website and it's creators
| 10| README.md | Details about the project
| 11| ASSUMPTIONS.md | Assumptions made in the project
| 12| css/ | Cascading Style Sheets (CSS) used to style the website
| 13| js/ | Javascript files for the webpages
| 14| assets/ | Images and icons used in the website

## Authors
Amey Karan - https://github.com/ameykaran2k22

Gaurav Behera - https://github.com/gaurav-behera