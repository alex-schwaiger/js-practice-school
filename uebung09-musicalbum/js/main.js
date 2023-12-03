/*
Project: uebung09-musicalbum
Author:  Schwaiger Alexander
Date:    2023/11/29
*/

'use strict';
const APPNAME = 'Vorlage';
document.getElementById('myTitle').innerText = APPNAME;
document.getElementById('myHeading').innerText = APPNAME;

const albums = new Map();

const generateTable = (map) => {
  const tableBody = document
    .getElementById('dynamic-table')
    .getElementsByTagName('tbody')[0];

  tableBody.innerHTML = '';

  for (const [key, album] of map) {
    const row = document.createElement('tr');

    // Add row number
    const rowNumber = document.createElement('th');
    rowNumber.setAttribute('scope', 'row');
    rowNumber.textContent = key;
    row.appendChild(rowNumber);

    // Add other columns
    const properties = ['artist', 'title', 'duration', 'releaseYear', 'rating'];
    for (const property of properties) {
      const cell = document.createElement('td');
      cell.textContent = album[property];
      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  }
};

const calculateAverageRating = (map) => {
  let totalRating = 0;
  let albumCount = 0;

  [...map.values()].forEach((album) => {
    totalRating += album.rating;
    albumCount++;
  });

  return totalRating / albumCount;
};

const findHighestRatedAlbums = (map) => {
  let highestRating = 0;
  let highestRatedAlbums = [];

  [...map.values()].forEach((album) => {
    if (album.rating > highestRating) {
      highestRating = album.rating;
      highestRatedAlbums = [album.title];
    } else if (album.rating === highestRating) {
      highestRatedAlbums.push(album.title);
    }
  });

  return highestRatedAlbums;
};

const findLowestRatedAlbums = (map) => {
  let lowestRating = Infinity;
  let lowestRatedAlbums = [];

  [...map.values()].forEach((album) => {
    if (album.rating < lowestRating) {
      lowestRating = album.rating;
      lowestRatedAlbums = [album.title];
    } else if (album.rating === lowestRating) {
      lowestRatedAlbums.push(album.title);
    }
  });

  return lowestRatedAlbums;
};

const filterAlbumsByDuration = (minDuration, maxDuration, map) => {
  if (minDuration > maxDuration) return;

  return [...map.values()].filter(
    (album) => album.duration >= minDuration && album.duration <= maxDuration
  );
};

const deleteAlbumsByArtist = (map, artist) => {
  [...map.values()].forEach((album) => {
    if (album.artist === artist) {
      map.delete(album.id);
    }
  });
};

const countAlbumsByArtist = (map) => {
  const artistCount = 0;

  [...map.values()].forEach((album) => {
    if (album.artist === artist) {
      artistCount++;
    }
  });

  return artistCount;
};

class MusicAlbum {
  static id = 100;

  #id;
  #title;
  #duration;
  #releaseYear;
  #rating;

  constructor(artist, title, duration, releaseYear, rating) {
    this.artist = artist;
    this.title = title;
    this.duration = duration;
    this.releaseYear = releaseYear;
    this.rating = rating;
    this.#id = MusicAlbum.id++;
  }

  checkIsEmpty(value) {
    return value !== '';
  }

  checkIsInRange(value, min, max) {
    return value >= min && value <= max;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  set title(value) {
    if (this.checkIsEmpty(value)) {
      this.#title = value;
    } else {
      this.#title = 'N/A';
    }
  }

  get duration() {
    return this.#duration;
  }

  set duration(value) {
    if (this.checkIsInRange(value, 5, 80)) {
      this.#duration = value;
    } else {
      this.#duration = 35;
    }
  }

  get releaseYear() {
    return this.#releaseYear;
  }

  set releaseYear(value) {
    if (this.checkIsInRange(value, 1960, 2023) && this.checkIsEmpty(value)) {
      this.#releaseYear = value;
    } else {
      this.#releaseYear = 2000;
    }
  }

  get rating() {
    return this.#rating;
  }

  set rating(value) {
    if (this.checkIsInRange(value, 1, 10) && this.checkIsEmpty(value)) {
      this.#rating = value;
    } else {
      this.#rating = 5;
    }
  }
}

document
  .getElementById('albumForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const artist = event.target.artist.value;
    const title = event.target.title.value;
    const duration = +event.target.duration.value;
    const releaseYear = +event.target.releaseYear.value;
    const rating = +event.target.rating.value;

    const album = new MusicAlbum(artist, title, duration, releaseYear, rating);
    albums.set(album.id, album);

    event.target.reset();
    generateTable(albums);
  });

document
  .getElementById('searchArtistForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    const artist = event.target.searchArtistInput.value;
    const filteredAlbums = new Map();
    for (const [key, album] of albums) {
      if (album.artist === artist) {
        filteredAlbums.set(key, album);
      }
    }
    event.target.reset();
    generateTable(filteredAlbums);
  });

document
  .getElementById('ratingStatistics')
  .addEventListener('click', function () {
    const output = document.getElementById('output');
    output.innerHTML = '';
    const averageRating = calculateAverageRating(albums);
    const highestRatedAlbums = findHighestRatedAlbums(albums);
    const lowestRatedAlbums = findLowestRatedAlbums(albums);
    output.innerHTML = `<ol class="list-group list-group-numbered">
  <li class="list-group-item"><strong>Durchschnittliche Bewertung: </strong>${averageRating.toFixed(
    1
  )}</li>
  <li class="list-group-item"><strong>Höchste Bewertung: </strong>${highestRatedAlbums.join(
    ', '
  )}</li>
  <li class="list-group-item"><strong>Niedrigste Bewertung: </strong>${lowestRatedAlbums.join(
    ', '
  )}</li>
</ol>`;
  });

document
  .getElementById('deleteAllAbulmsByArtist')
  .addEventListener('submit', function (event) {
    const artist = event.target.artistInput.value;
    const isConfirmed = confirm('Sind Sie sich sicher?');
    if (isConfirmed) {
      deleteAlbumsByArtist(albums, artist);
      generateTable(albums);
    }
  });

document
  .getElementById('deleteAllAlbums')
  .addEventListener('click', function () {
    const isConfirmed = confirm('Sind Sie sich sicher?');
    if (isConfirmed) {
      albums.clear();
      generateTable(albums);
    }
  });
