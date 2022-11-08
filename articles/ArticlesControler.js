const express = require('express');
const Category = require('../categories/Category');
const router = express.Router();
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin/articles', adminAuth,(req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render("admin/articles/index", {articles:articles, session: req.session.user});
    })
});


router.get("/admin/articles/new", adminAuth, (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories, session: req.session.user});
    });
});

router.post("/articles/save", (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/articles")
    })
});

router.post("/articles/delete", (req,res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        }else{ //Not a number
            res.redirect("/admin/articles");
        }
    }else{  // NUll or undefined
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res) => {
    var id = req.params.id;
    Article.findOne({
        where:{
            id:id
        }
    }).then(article => {
        Category.findAll().then(categories => {
            res.render("admin/articles/edit",{article:article, categories:categories, session: req.session.user});
        })
    })
});

router.post("/articles/update", (req,res) => {
    var title = req.body.title;
    var body = req.body.body;
    var id = req.body.id;
    var category = req.body.category;
    Article.update({title:title, body:body, slug:slugify(title), categoryId: category},{
        where:{
            id:id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    })
});

router.get("/articles/page/:num", (req,res) => {
    var page = req.params.num;
    var offset;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = 4 * (parseInt(page) - 1);
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[
            ["id","DESC"]
        ]
    }).then(articles => {

        var next;

        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next : next,
            articles : articles,
            page: parseInt(page)
        }

        Category.findAll({
    
        }).then(categories => {
            res.render("admin/articles/page", {result:result, categories:categories, session: req.session.user})
        }).catch(err =>{
            res.redirect("/")
        });
    }).catch(err => {
        res.redirect("/");
    })
})

module.exports = router;