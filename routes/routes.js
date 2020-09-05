const express = require('express')
const router = express.Router();
const fs=require('fs')
router.get('/', (req, res) => {
    fs.readFile(`apidocs.json`, (err, json) => {
        if (err) {
            res.status(400).json({
                error:err
            })
        }
        const docs = JSON.parse(json)
        res.json(JSON.parse(json))
    })
})

module.exports = router
