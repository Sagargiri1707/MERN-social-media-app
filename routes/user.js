const express = require('express')
const router = express.Router();
const _ =require('lodash')
const userSchema = require('../schema/userSchema')
const expressJwt=require('express-jwt')
const formidable = require('formidable')
const fs=require('fs')
const {
    userbyId,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople
} =require('../middlewares/middleware')

router.get('/getusers', (req, res) => {
    userSchema.find((err, users) => {
        if (err) {
            res.json({
                error:err
            })
        }
        return res.json(users );
    })
})


router.get('/:userId',expressJwt({
        secret: process.env.JWT,
        userProperty:'auth'
    }),
    (req, res) => {
        req.profile.salt = undefined
        req.profile.hashed_password=undefined
       res.json( req.profile)
})
router.put('/follow',
    expressJwt({
            secret: process.env.JWT,
            userProperty:'auth'
        }),
        addFollowing,
        addFollower
)
router.put('/unfollow', expressJwt({
            secret: process.env.JWT,
            userProperty:'auth'
}),
    
        removeFollowing,
        removeFollower
) 

router.put('/updateuser/:userId', expressJwt({
        secret: process.env.JWT,
        userProperty:'auth'
    }),
    (req, res) => {


    let form = new formidable.IncomingForm();
        form.keepExtensions = true;
        
        form.parse(req, (err, fields, files) => {
            for (var x in fields) {
                if (x === 'followers' || x === 'following')
                {
                    fields[x]=JSON.parse(fields[x])               
    
                }
                    
            }
                if (err) {
            return res.json({
                error: 'Photo could not be uploaded'
            });
        }
        
        
        let user = req.profile;
        
        
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        user.save((err, result) => {
            if (err) {
                return res.json({
                    error: err
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });

    })
router.get('/getphoto/:userId', (req, res, next) => {
    
    if (req.profile.photo) {
        res.set('Content-Type',req.profile.photo.contentType)
        
        res.send(req.profile.photo.data)
    }    
})  
router.delete('/removeuser/:userId', expressJwt({
        secret: process.env.JWT,
        userProperty:'auth'
    }),
    (req, res) => {
        req.profile.salt = undefined
        req.profile.hashed_password=undefined
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            message:"User deleted successfully"   
        })
    })
    })

    router.get('/findpeople/:userId',expressJwt({
        secret: process.env.JWT,
        userProperty:'auth'
    }),
        findPeople 
    )
router.param('userId', userbyId)



module.exports = router
