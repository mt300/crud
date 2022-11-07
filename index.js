const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-ession");

const categoriesController = require("./categories/CategoriesControler");
const articlesController = require("./articles/ArticlesControler");
const usersController = require("./user/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");


// View Engine
app.set("view engine","ejs");

// Sessions

app.use(session({
    secret: "rola",
    cookie: {maxAge: 30000}
}))

// Static 
app.use(express.static('public')); 

// Body Parser
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
app.use("/",usersController);


// Routes
app.get('/', (req, res) => {
    Article.findAll({
        order:[
            ["id","DESC"]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles:articles, categories:categories});
        });
    });
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where:{
        slug:slug
    }
  }).then(article => {
    if( article != undefined){
        Category.findAll().then(categories => {
            res.render('article', {article:article, categories:categories});
        });
    }else{
        res.redirect("/");
    }
  }).catch(error => {
    res.redirect("/");
  })
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {categories: categories, articles:category.articles});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
