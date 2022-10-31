const express = require('express');
const router = express.Router();

const app = express()
const port = 3000

router.get('/articles', (req, res) => {
    res.send('Hello World! Articles');
});

router.get("/admin/articles/new", (req,res) => {
    res.send("Route to create a new article");
})

module.exports = router;