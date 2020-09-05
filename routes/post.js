const express = require('express')
const router = express.Router();
const PostSchema = require('../schema/postSchema')
const _ =require('lodash')

const {
    userbyId,postbyId
} =require('../middlewares/middleware')

const { check, validationResult } = require('express-validator');
const expressJwt = require('express-jwt')
const formidable = require('formidable')
const fs=require('fs')
require('dotenv').config()


router.get('/',
    (req, res) => {
        PostSchema.find()
            .populate("postedBy","_id name")
            .select('_id title body')
            .then(response => {
                res.json({ posts: response })        
            })
    })
router.get('/by/:userId',
        expressJwt({
            secret: process.env.JWT,
            userProperty: 'auth'
        })
        ,
    (req, res) => {
    PostSchema
        .find({ postedBy: req.profile._id })
        .populate('postedBy', "_id name ")
        .sort("_created")
        .exec((err, post) => {
            if (err) {
                return res.status(400).json({
                    error:err
                })
            }
            res.json(post)
    })

    }
)
router.delete('/delete/:postId',
    expressJwt({
            secret: process.env.JWT,
            userProperty: 'auth'
        }),
    (req, res,next) => {
        let isposter = req.post && req.auth && req.post.postedBy._id == req.auth._id
        
        if (!isposter) {
            return res.status(403).json({
                error:"User not authorized"
            }) 
        }
        next()
    },
    (req, res) => {
        let post = req.post
        post.remove((err, post) => {
            if (err)
            {
                res.status(400).json({
                    error:err
                })

            }
            res.json({
                message:"Deleted successfully"
            })
        })

         
    
    })

router.put('/update/:postId',
    expressJwt({
        secret: process.env.JWT,
        userProperty:"auth"
    }),
    (req, res, next) => {
            let isposter = req.post && req.auth && req.post.postedBy._id == req.auth._id        
            if (!isposter) {
                return res.status(403).json({
                    error:"User not authorized"
                }) 
            }
            next()
        },
    (req, res) => {            
        let post = req.post;
        post = _.extend(post, req.body)
        post.updated = Date.now()
        
        post.save((Err) => {
            if (Err) {
                return res.status(400).json({
                    error:Err
                })
            }  
        })    
        res.json(post)

})
    

router.post('/newpost/:userId',

        expressJwt({
            secret: process.env.JWT,
            userProperty: 'auth'
        })
       ,
    (req, res, next) => {

        [
            check("body","Write a body").notEmpty(),
            check('body', "body must be between 4 to 1500 charcter").isLength({
                min: 4,
                max:1500
            }),
            check("title", "Write a title").notEmpty(),
            check('title', "title must be between 4 to 150 charcter").isLength({
                min: 4,
                max:150
            })
        ]
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
                const err = errors.errors.map(data => data.msg)
                return res.status(400).json({ error:err });
        }

        next()

    }
     ,
    (req, res, next) => {     
        
        let form = new formidable.IncomingForm()
        form.keepExtensions = true        
        form.parse(req, (err, fields, files) => {
                   
            if (err) {
                return res.status(400).json({
                    error:"Image not uplaoded"
                }) 
            }
            let post = new PostSchema(fields)

            post.postedBy=req.profile

            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path),
                post.photo.contentType=fs.photo.type
            }
            
            post.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error:err
                    })
                }
                res.json({result})
            })
            
        })
        
})


router.param('postId',postbyId)


router.param('userId',userbyId)

module.exports = router
