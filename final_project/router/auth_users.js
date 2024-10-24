const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.find((user) => (user.username===username)&&(user.password===password));    
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!authenticatedUser(username, password)) {
        return res.status(403).json("Username or password are incorrect. please try again.");
    }
    const accessToken = jwt.sign({
        data: username
    }, 'access', { expiresIn: 60 * 60 })
    req.session.authorization = {
        accessToken
    }
    res.send("User logged in Successfully")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let bookInfo = books[isbn]
    if (bookInfo) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            bookInfo.reviews[reviewer] = review;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
});

module.exports.authenticated = regd_users;
module.exports.users = users;
