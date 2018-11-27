let movieSearch = (function () { // declaring an iife

    /*globals APIKEY*/

    const movieDataBaseURL = 'https://api.themoviedb.org/3/';
    const imageBaseURL = 'https://image.tmdb.org/t/p/w185';
    let imageURL = null;
    let imagesSizes = [];
    let searchString = "";
    let prefList = document.getElementsByName("pref");
    let prefType = 'movie';



    document.addEventListener("DOMContentLoaded", init);



    function init() {
        console.log(APIKEY);
        addEventListeners();
        getDataFromLocalStorage();




        //*********DO NOT EDIT************
        document.querySelector(".modalButton").addEventListener("click", showOverlay);
        document.querySelector(".cancelButton").addEventListener("click", hideOverlay);
        document.querySelector(".saveButton").addEventListener("click", function (e) {
            for (let i = 0; i < prefList.length; i++) {
                if (prefList[i].checked) {
                    prefType = prefList[i].value;
                    break;
                }
            }
            console.log("You picked " + prefType)
            if (prefType == "movie") {
                console.log("movie page");
                document.querySelector("#movie").classList.remove("hide");
                document.querySelector("#tv").classList.add("hide");
            } else {
                console.log("tv page")
                document.querySelector("#movie").classList.add("hide");
                document.querySelector("#tv").classList.remove("hide");
            }
            hideOverlay(e);

        });
        //*********DO NOT EDIT******



    }
    //*****END OF INIT**********


    function addEventListeners() {

        let searchButton = document.querySelector('.searchButtonDiv');
        searchButton.addEventListener('click', startSearch);

        let backButton = document.querySelector('.backButtonDiv');
        backButton.addEventListener("click", function () {
            document.querySelector("#search-results").classList.add("hide");
            document.querySelector("#movie").classList.remove("hide");
            document.querySelector("#recommend-results").classList.add("hide");
            document.querySelector("#search-results>.content").innerHTML = "";


        });
    }

    function getDataFromLocalStorage() {


        //check if image secure URL and sizes array are saved in local storage, if not all getPosterURLAndSizes()



        //if in local storage check if saved over 60 min ago, if true then call getPosterURLAndSizes()

        // in local storage and less than 60min old, load and use from local storage

        getPosterURLAndSizes();
    }

    function getPosterURLAndSizes() {
        let url = `${movieDataBaseURL}configuration?api_key=${APIKEY}`;

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                imageURL = data.images.secure_base_url;
                imagesSizes = data.images.poster_sizes;

                console.log(imageURL);
                console.log(imagesSizes);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    function startSearch() {
        console.log("start search");

        //    searchString = document.getElementById("search-input").value;
        searchString = document.querySelector('.search-input').value;
        if (!searchString) {
            alert("Please enter search data");
            document.getElementById("search-input").focus();
            return;
        }
        // this is a new search so you should reset any existing page data
        document.querySelector("#search-results>.content").innerHTML = "";

        getSearchResults(searchString);
        document.querySelector("#search-results").classList.remove("hide");
        document.querySelector("#movie").classList.add("hide");
        document.querySelector("#tv").classList.add("hide");

    }

    function getSearchResults() {
        let url = `${movieDataBaseURL}search/${prefType}?api_key=${APIKEY}&query=${searchString}`;
        fetch(url)
            .then(response => response.json())
            .then(function (data) {



                if (prefType == "movie") {
                    data.results.forEach(function (item) {


                        let movie = {
                            title: item.original_title,
                            release_date: item.release_date,
                            vote_average: item.vote_average,
                            overview: item.overview,
                            poster_path: item.poster_path,
                            movieId: item.id

                        }
                        let content = document.querySelector("#search-results>.content");

                        let cards = [];

                        cards.push(createMovieCard(movie));
                        let documentFragment = new DocumentFragment();

                        cards.forEach(function (item) {
                            documentFragment.appendChild(item);
                        });

                        content.appendChild(documentFragment);

                        let cardList = document.querySelectorAll(".content>div");
                        cardList.forEach(function (item) {
                            item.addEventListener("click", getRecommendations);
                        });

                    })

                } else if (prefType == "tv") {
                    data.results.forEach(function (item) {


                        let movie = {
                            title: item.original_name,
                            release_date: item.first_air_date,
                            vote_average: item.vote_average,
                            overview: item.overview,
                            poster_path: item.poster_path,
                            movieId: item.id

                        }
                        let content = document.querySelector("#search-results>.content");

                        let cards = [];

                        cards.push(createMovieCard(movie));
                        let documentFragment = new DocumentFragment();

                        cards.forEach(function (item) {
                            documentFragment.appendChild(item);
                        });

                        content.appendChild(documentFragment);

                        let cardList = document.querySelectorAll(".content>div");
                        cardList.forEach(function (item) {
                            item.addEventListener("click", getRecommendations);
                        });

                    });

                }

            })
    }

    //DO NOT EDIT************
    function showOverlay(e) {
        e.preventDefault();
        let overlay = document.querySelector(".overlay");
        overlay.classList.remove("hide");
        overlay.classList.add("show");
        showModal(e);
    }

    function showModal(e) {
        e.preventDefault();
        let modal = document.querySelector(".modal");
        modal.classList.remove("off");
        modal.classList.add("on");
    }

    function hideOverlay(e) {
        e.preventDefault();
        e.stopPropagation(); // don't allow clicks to pass through
        let overlay = document.querySelector(".overlay");
        overlay.classList.remove("show");
        overlay.classList.add("hide");
        hideModal(e);
    }

    function hideModal(e) {
        e.preventDefault();
        let modal = document.querySelector(".modal");
        modal.classList.remove("on");
        modal.classList.add("off");
    }
    //***************DO NOT EDIT


    function createMovieCard(movie) {
        let documentFragment = new DocumentFragment(); // use a documentFragment for performance

        let movieCard = document.createElement("div");
        let section = document.createElement("section");
        let image = document.createElement("img");
        let videoTitle = document.createElement("p");
        let videoDate = document.createElement("p");
        let videoRating = document.createElement("p");
        let videoOverview = document.createElement("p");

        // set up the content
        videoTitle.textContent = movie.title;
        videoDate.textContent = movie.release_date;
        videoRating.textContent = movie.vote_average;
        videoOverview.textContent = movie.overview;

        // set up image source URL
        image.src = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;


        // set up movie data attributes
        movieCard.setAttribute("data-title", movie.title);
        movieCard.setAttribute("movie-id", movie.movieId);

        // set up class names
        movieCard.className = "movieCard";
        section.className = "imageSection";

        // append elements
        section.appendChild(image);
        movieCard.appendChild(section);
        movieCard.appendChild(videoTitle);
        movieCard.appendChild(videoDate);
        movieCard.appendChild(videoRating);
        movieCard.appendChild(videoOverview);

        documentFragment.appendChild(movieCard);

        return documentFragment;
    }

    function getRecommendations(e) {

        console.log(this);
        console.log(e.target);

        let movieTitle = this.getAttribute("data-title");
        let movieId = this.getAttribute("movie-Id");

        console.log("you clicked: " + movieTitle);
        console.log("you clicked: " + movieId);


        document.querySelector("#search-results").classList.add("hide");
        document.querySelector("#recommend-results").classList.remove("hide");


        document.querySelector("#recommend-results>.content").innerHTML = "";

        let url = `${movieDataBaseURL}${prefType}/${movieId}/recommendations?api_key=${APIKEY}&language=en-US&page=1`

        fetch(url)
            .then(response => response.json())
            .then(data => {

                if (prefType == "movie") {
                    data.results.forEach(function (item) {
                        let movie = {
                            title: item.original_title,
                            release_date: item.release_date,
                            vote_average: item.vote_average,
                            overview: item.overview,
                            poster_path: item.poster_path,
                            movieId: item.id

                        }
                        let content = document.querySelector("#recommend-results>.content");

                        let cards = []; // an array of document fragments


                        cards.push(createMovieCard(movie));
                        let documentFragment = new DocumentFragment();

                        cards.forEach(function (item) {
                            documentFragment.appendChild(item);
                        });

                        content.appendChild(documentFragment);

                        let cardList = document.querySelectorAll(".content>div");
                        cardList.forEach(function (item) {
                            item.addEventListener("click", getRecommendations);
                        });

                    })
                } else if (prefType == "tv") {
                    data.results.forEach(function (item) {
                        let movie = {
                            title: item.original_name,
                            release_date: item.first_air_date,
                            vote_average: item.vote_average,
                            overview: item.overview,
                            poster_path: item.poster_path,
                            movieId: item.id

                        }
                        let content = document.querySelector("#recommend-results>.content");

                        let cards = []; // an array of document fragments


                        cards.push(createMovieCard(movie));

                        let documentFragment = new DocumentFragment();

                        cards.forEach(function (item) {
                            documentFragment.appendChild(item);
                        });

                        content.appendChild(documentFragment);

                        let cardList = document.querySelectorAll(".content>div");
                        cardList.forEach(function (item) {
                            item.addEventListener("click", getRecommendations);
                        });

                    })
                }



                document.querySelector(".recommendations").innerHTML = ("Recommendation Results 1 - " + data.results.length);
            })
            .catch(error => console.log(error));

    }

})(); // closing the iife, note the extra ()
