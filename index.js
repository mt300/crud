const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesControler");
const articlesController = require("./articles/ArticlesControler");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

app.set("view engine","ejs");

app.use(express.static('public')); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database

connection
    .authenticate()
    .then( () => {
        console.log("Connected Succesfully");
    }).catch((error) => {
        console.log(error);
    });

// Controlers

app.use("/",categoriesController);
app.use("/",articlesController);


// Routes
app.get('/', (req, res) => {
    res.render('index');
});


app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
