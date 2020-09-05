const userSchema = require('../schema/userSchema')
const postSchema = require('../schema/postSchema')


exports.userbyId = (req, res, next, id) => {  
    
    userSchema
        .findById(id)
        .populate('following', "_id name")
        .populate('followers','_id name')
    .exec((err, user) => {
            if (err || !user) {
                return res.json({
                    error:"User not found"
                })
            }
        user.salt = undefined
        user.hashed_password=undefined
            req.profile = user
            next()
        }
    )
}
exports.postbyId= (req, res, next, id) => {
    postSchema
        .findById(id)
        .populate('postedBy', "_id name")
        .exec((err, post) => {
            if (err || !post) {
                return res.json({
                    error:err
                })
            }
            req.post = post            
            next()
        })
}

exports.addFollowing = (req, res, next) => {
    
    userSchema
        .findByIdAndUpdate(req.body.userId, {
            $push: { following: req.body.followId }
        }, (err, result) => {
            
        if (err) {

            return res.json({ error: err });

        }

        next();

    });
}
exports.addFollower = (req, res, next) => {

    userSchema
        .findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })

    .populate('following', '_id name')

    .populate('followers', '_id name')

    .exec((err, result) => {

        if (err) {

            return res.json({

                error: err

            });

        }

        result.salt = undefined
        result.hashed_password=undefined
        res.json(result);

    });
}
exports.removeFollower = (req, res) => {
    userSchema
    .findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })

    .populate('following', '_id name')

    .populate('followers', '_id name')

    .exec((err, result) => {

        if (err) {

            return res.json({

                error: err

            });

        }

        result.hashed_password = undefined;

        result.salt = undefined;

        res.json(result);

    });

}

exports.removeFollowing = (req, res, next) => {
    userSchema
    .findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {

        if (err) {

            return res.json({ error: err });

        }

        next();

    });
}
exports.findPeople = (req, res) => {
    let following = req.profile.following
    following.push(req.profile._id)
    userSchema.find({
        _id: {
            $nin :following
        }
    }, (err, users) => {
            if (err)
                return res.json({ error: err })
            res.json(users)
    }).select('name')

}