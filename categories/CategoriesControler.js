const express = require('express');
const router = express.Router();

const app = express()
const port = 3000

router.get('/categories', (req, res) => {
    res.send('Hello World! Categories');
});

router.get("/admin/categories/new", (req,res) => {
    res.render("admin/categories/new");
})

module.exports = router;