const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router()
const axios = require('axios').default;

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    } else if (!username) {

        return res.status(404).json({ message: "Unable to register user: No Username." });
    } else if (!password) {
        return res.status(404).json({ message: "Unable to register use: No Password." });

    }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    res.status(200).send(JSON.stringify(books))
})

// Task 10: Get the book list available in the shop using async/await
async function getBooks(url) {
    try {
        const res = await axios.get(url)
        console.log(" Status: ", res.status, res.statusText, "\n", "Data: ", res.data)
    } catch (error) {
        console.error(error)
    }
}
// // Replace your USERNAME-PORT with your username and port 
//   asimelsanosi-5000
// getBooks('https://asimelsanosi-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/')


// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn
    if (typeof (books[isbn]) === 'undefined') {
        res.status(400).send("Bad Request: Book Unavailable!")
    } else {
        res.status(200).send(JSON.stringify(books[isbn]))
    }
})

// Task 11: Get book details based on ISBN
async function getBookUsingIsbn(url) {
    try {
        const res = await axios.get(url)
        console.log(" Status: ", res.status, res.statusText, "\n", "Data: ", res.data)
    } catch (error) {
        console.error(error)
    }
}
// // Replace your USERNAME-PORT with your username and port 
//   asimelsanosi-5000
// getBookUsingIsbn('https://asimelsanosi-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/10')


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author
    const booksValues = Object.values(books)
    const filteredAuthor = booksValues.filter((item) => item.author === author)
    res.status(200).send(JSON.stringify(filteredAuthor))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title
    const booksValues = Object.values(books)
    const filteredTitle = booksValues.filter((item) => item.title === title)
    res.status(200).send(JSON.stringify(filteredTitle))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    res.status(200).send(JSON.stringify(books[isbn].reviews))
});

module.exports.general = public_users;
