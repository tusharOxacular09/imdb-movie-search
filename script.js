const key = "48aa722f"; // API key for accessing OMDB API
let searchInput = document.getElementById("Input"); // Input element for movie search
let displaySearchList = document.getElementsByClassName("fav-container"); // Container to display search results

// Fetch example movie data from OMDB API
fetch("http://www.omdbapi.com/?i=tt3896198&apikey=48aa722f")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Initiate findMovies function upon keypress
searchInput.addEventListener("input", findMovies);

// Function to display details of a single movie
async function singleMovie() {
  // Finding ID of the movie from the URL
  let urlQueryParams = new URLSearchParams(window.location.search);
  let id = urlQueryParams.get("id");
  console.log(id);
  const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();
  console.log(data);
  console.log(url);

  // Generating HTML output using string interpolation
  let output = `
        <div class="movie-poster">
            <img src=${data.Poster} alt="Movie Poster">
        </div>
        <div class="movie-details">
            <div class="details-header">
                <div class="dh-ls">
                    <h2>${data.Title}</h2>
                </div>
                <div class="dh-rs">
                    <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
                </div>
            </div>
            <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
            <ul class="details-ul">
                <li><strong>Actors: </strong>${data.Actors}</li>
                <li><strong>Director: </strong>${data.Director}</li>
                <li><strong>Writers: </strong>${data.Writer}</li>
            </ul>
            <ul class="details-ul">
                <li><strong>Genre: </strong>${data.Genre}</li>
                <li><strong>Release Date: </strong>${data.DVD}</li>
                <li><strong>Box Office: </strong>${data.BoxOffice}</li>
                <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
            </ul>
            <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
            <p style="font-size: 15px; font-style: italic; color: #222; margin-top: 10px;">
                <i class="fa-solid fa-award"></i>
                &thinsp; ${data.Awards}
            </p>
        </div> 
    `;

  // Appending the output
  document.querySelector(".movie-container").innerHTML = output;
}

// Function to add a movie to favorites
async function addTofavorites(id) {
  console.log("fav-item", id);

  // Using Math.random for a unique key and value pair
  localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
  alert("Movie Added to Favorites!");
}

// Function to remove a movie from favorites
async function removeFromfavorites(id) {
  console.log(id);
  for (i in localStorage) {
    // If the ID passed as argument matches with value associated with key, then removing it
    if (localStorage[i] == id) {
      localStorage.removeItem(i);
      break;
    }
  }
  // Alerting the user and refreshing the page
  alert("Movie Removed from Favorites");
  window.location.replace("favorite.html");
}

// Function to display the movie list on the search page according to the user list
async function displayMovieList(movies) {
  let output = "";
  // Traversing over the movies list which is passed as an argument to our function
  for (i of movies) {
    let img = "";
    if (i.Poster != "N/A") {
      img = i.Poster;
    } else {
      img = "./assets/images/blank-poster.webp";
    }
    let id = i.imdbID;

    // Appending the output through string interpolation
    output += `
            <div class="fav-item">
                <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favorites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                            <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                        </div>
                        <div>
                            <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }
  // Appending this to the movie-display class of our HTML page
  document.querySelector(".fav-container").innerHTML = output;
  console.log("here is movie list ..", movies);
}

// Function to search for movies based on user input
async function findMovies() {
  const url = `https://www.omdbapi.com/?s=${searchInput.value.trim()}&page=1&apikey=${key}`;
  const res = await fetch(`${url}`);
  const data = await res.json();

  if (data.Search) {
    // Calling the function to display list of the movies related to the user search
    displayMovieList(data.Search);
  }
}

// Function to load favorite movies from local storage
async function favoritesMovieLoader() {
  let output = "";
  // Traversing over all the movies in the local storage
  for (i in localStorage) {
    let id = localStorage.getItem(i);
    if (id != null) {
      // Fetching the movie through ID
      const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
      const res = await fetch(`${url}`);
      const data = await res.json();
      console.log(data);

      let img = "";
      if (data.Poster) {
        img = data.Poster;
      } else {
        img = data.Title;
      }
      let Id = data.imdbID;
      // Adding all the movie HTML in the output using interpolation
      output += `
                <div class="fav-item">
                    <div class="fav-poster">
                        <a href="movie.html?id=${id}"><img src=${img} alt="Favorites Poster"></a>
                    </div>
                    <div class="fav-details">
                        <div class="fav-details-box">
                            <div>
                                <p class="fav-movie-name">${data.Title}</p>
                                <p class="fav-movie-rating">${data.Year} &middot; <span
                                        style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                            </div>
                            <div style="color: maroon">
                                <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }
  }
  // Appending the HTML to the movie-display class in favorites page
  document.querySelector(".fav-container").innerHTML = output;
}
