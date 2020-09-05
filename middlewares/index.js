const { check, validationResult } = require('express-validator');


export const postValidation = (req, res, next) => {
    
        req.check("body","Write a body").notEmpty(),
        req.check('body', "body must be between 4 to 1500 charcter").isLength({
            min: 4,
            max:1500
        }),
        req.check("title", "Write a title").notEmpty(),
        req.check('title', "title must be between 4 to 150 charcter").isLength({
            min: 4,
            max:150
        })
    const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
            const err = errors.errors.map(data => data.msg)
            return res.status(400).json({ error:err });
      }
}
