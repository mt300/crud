const express = require('express');
const Category = require('../categories/Category');
const router = express.Router();

// router.get('/articles', (req, res) => {
//     // res.send("Route to create a new article");
// });

router.get("/admin/articles/new", (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories});
    });
});

// router.get("/admin/articles")

module.exports = router;