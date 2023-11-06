// Add DOM selectors to target input and UL movie list
let inp = document.getElementById("newMovieInput");
let myMovieList = document.getElementById("movie-list");
let filter = document.getElementById("filter");
let movieList = {};
let movieHistory = document.getElementById("movie-history");

//Below code executes on window open
window.onload = function(){
    keys = Object.keys(localStorage)
    for(var i = 0; i < keys.length; i++){
        movieList[keys[i]] = localStorage[keys[i]]
        appendLi(myMovieList, keys[i])
        newMovie(keys[i])
    }

}

// Example of a simple function that clears the input after a user types something in
function clearInput() {
    inp.value = "";
}

function clearMovies() {
    // To delete all children of the <ul></ul> (meaning all <li>'s)..we can wipe out the <ul>'s innerHTML
    myMovieList.innerHTML = '';
}

// This function is executed when the user clicks [ADD MOVIE] button.
function addMovie() {
    // Step 1: Get value of input
    userTypedText = inp.value

    // Step 2: Validate contents
    if(userTypedText == ''){
        alert("Try adding the name of a movie first!")
        return null
    }

    // Step 3: Parse the input
    words = userTypedText.split(" ");
    if(words.length > 1){
        movieName = ''
        words.foreach((word) => {
            movieName += word.charAt(0).toUpperCase() + word.slice(1);
        })
    }
    else{
        movieName = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }

    // Step 4: Check if the movie has been seen already if not, add it to the object 'movieList'
    if(Object.keys(movieList).includes(movieName)){
        movieList[movieName] += 1
        clearInput();
        incrementMovie(movieName);
        return null
    }
    movieList[movieName] = 1

    //steps 5-8 handled in this function
    appendLi(myMovieList, movieName)

    // Step 9: Call the clearInput function to clear the input field
    clearInput();

    // Step 10: Add the new movie to the history table 
    newMovie(movieName);
}

//This function creates a new row in the table when a new movie is typed in to the entry bar
function newMovie(movieName){
    //create elements
    let movieNode = document.createTextNode(movieName);
    let tr = document.createElement('tr');
    let nametd = document.createElement('td');
    let watchCounttd = document.createElement('td');

    //append the pieces 
    nametd.appendChild(movieNode);
    watchCounttd.appendChild(document.createTextNode(movieList[movieName]));
    tr.appendChild(nametd);
    tr.appendChild(watchCounttd);
    movieHistory.appendChild(tr);

    movieID = movieName.replace(/\s+/g, '');
    tr.setAttribute("id", movieID);

}

//This function adjusts the watched count column in the table when a movie has been seen past the first time
function incrementMovie(movieName){
    movieID = movieName.replace(/\s+/g, '');
    let targetMovie = document.getElementById(movieID);
    const tdElements = targetMovie.querySelectorAll('td');
    tdElements[1].innerText = movieList[movieName];
}

//this function takes a ul element to add the li too, and the content to place in the li element
function appendLi(ul, text){
    // Step 1: Create an empty <li></li>
    let li = document.createElement("li"); // <li></li>

    // Step 2: Prepare the text we will insert INTO that li ^...example: Harry Potter
    let textToInsert = document.createTextNode(text);


    // Step 3: Insert text into li
    // <li>Harry Potter </li>
    li.appendChild(textToInsert);

    // Step 4: Insert the <li>Harry Potter</li> INTO the <ul>
    ul.appendChild(li);
}

// This code is exceuted as the user types into the filter field
filter.addEventListener('input', () => {
    clearMovies();
    for (const key in movieList) {
        if(key.includes(filter.value)){
            let li = document.createElement("li"); // <li></li>

            let textToInsert = document.createTextNode(key);

            li.appendChild(textToInsert);

            myMovieList.appendChild(li);
        }
    }
})


//this code runs before a refresh or closing the tab
window.onbeforeunload = function(){
    keys = Object.keys(movieList);
    //loops through all movies in the 'movieList' object
    for(var i = 0; i < keys.length; i++){
        //checks to see if they are already in local storage and if they are, verifies that the watch count is the correct value.
        //if either are false, it writes the current pair to local storage
        if((!(keys[i] in Object.keys(localStorage))) || (movieList[keys[i]]) != localStorage.getItem(keys[i])) {
            localStorage.setItem(keys[i], movieList[keys[i]])
        }
    }
}