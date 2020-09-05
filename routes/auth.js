const express = require('express')
const router = express.Router();
const userSchema = require('../schema/userSchema')
const {
    userbyId
} =require('../middlewares/middleware')

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.post('/signup', [
    check('name', 'Name is required').notEmpty(),
    check('email', "Email must be valid")
        .matches(/.+\@.+\..+/)
        .withMessage("not a valid mail id"),
    check("password","password is required").notEmpty(),
    check('password')
        .isLength({
            min: 6
        })
        .withMessage('Atleast 6 characters')
        .matches(/\d/)
        .withMessage('password must contain a number')
    
],
    async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
            const err = errors.errors.map(data => data.msg)
            return res.json({ error:err });
        }
        
    const userExists = await userSchema.findOne({ email: req.body.email })
    
        if (userExists) {
            
        return res.json({
            error:
            ["Email is taken"]
        })
    }
    const user = new userSchema(req.body)
    await user.save()
    res.json({ message:"Signup success! please login" }
    )
})


router.post('/signin', (req, res) => {
    const { email, password } = req.body
    userSchema.findOne({ email }, (err, user) => {
        if (err || !user)
        {
            return res.json({
                error:['User with that email does not exists']
            })
        }
        if (!user.authenticate(password)) {
            return res.json({
                error:["Email and password doesnt match"]
            })
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT);
        res.cookie('t', token, { expire: new Date() + 9999 })
        const { _id, name, email } = user
        return res.json({
            token, user: {
                _id, email, name
            }
        })
    })
})

router.post('/signout', (req, res) => {
    res.clearCookie('t')
    return res.json({message:"Signout success!"})
})

router.param('userId',userbyId)

module.exports = router
