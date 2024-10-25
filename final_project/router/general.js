const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Username or password missing." });
});

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
//promise for task 10
const getBookPromise = () => new Promise((resolve, reject) => {
    try {
        const result = JSON.stringify(books, null, 4)
        resolve(result);
    }
    catch (err) {
        reject(err)
    }
})


//task 10
public_users.get('/', function (req, res) {
    getBookPromise().then((result) => res.send(result)).catch((err) => res.status(400).json({ message: "could not get the books" }))


});


// Get the book list available in the shop (task 1)
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});





// Get book details based on ISBN (task 2)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const bookByIsbn = books[isbn];
    res.send(bookByIsbn);
});

//promise for task 11
const getByISBNPromise = (isbn) => new Promise((resolve, reject) => {
    try {
        const result = books[isbn];
        resolve(result);
    }
    catch (err) {
        reject(err)
    }
})

//task 11
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    getByISBNPromise(isbn).then((result) => res.send(result)).catch((err) => res.status(400).json({ message: "could not get the books" }))

});

/*
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).find(book => book.author === author)
    res.send(book || `there is no book under the name: ${author}`)
});

*/

//promise for task 12
const getByAuthorPromise = (author) => new Promise((resolve, reject) => {
    try {
        const result = Object.values(books).find(book => book.author === author);
        resolve(result);
    }
    catch (err) {
        reject(err)
    }
})

//task 12
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    getByAuthorPromise(author).then((result) => res.send(result)).catch((err) => res.status(400).json({ message: "could not get the books" }))

});

/*
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).find(book => book.title === title)
    res.send(book || `there is no book under the title: ${title}`)
});
*/
//promise for task 13
const getByTitlePromise = (title) => new Promise((resolve, reject) => {
    try {
        const result = Object.values(books).find(book => book.title === title);
        resolve(result);
    }
    catch (err) {
        reject(err)
    }
})

//task 13
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    getByTitlePromise(title).then((result) => res.send(result)).catch((err) => res.status(400).json({ message: "could not get the books" }))

});



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
