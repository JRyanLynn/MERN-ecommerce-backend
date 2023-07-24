const router = require('express').Router();
const Review = require('../models/Reviews');
const {verifyToken, verifyTokenAuth, verifyTokenAdmin} = require('./verifyToken');

//post
//http://localhost:5000/api/reviews
router.post('/', verifyToken, async (req, res) => {
    const newReview = new Review(req.body);

    try {
        const savedReview = await newReview.save();
        res.status(200).json(savedReview);
    } catch (error) {
        //need error handing for ratings, username, reviews (can use js to check for empty string)
        res.status(500).json(error);
    }
})

//get
//http://localhost:5000/api/reviews
router.get('/', async (req, res) => {
    try {
        let reviews = [];
            reviews = await Review.find({});
        res.status(200).json(reviews);
    } catch (error) {
        //need error handing for ratings, username, reviews (can use js to check for empty string)
       return res.status(500).json(error);
    }
})

//delete admin only
//http://localhost:5000/api/reviews/id
//requires barer token to access
router.delete('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json('Product deleted')
    } catch (err) {
        res.status(500).json(err);
    }
});

//find by username
//http://localhost:5000/api/reviews/username
//need barer token
router.get('/:username', verifyTokenAdmin, async (req, res) => {
    try {
        const username = req.params.username;
        const reviews = await Review.find({username: username});
        res.status(200).json(reviews);
    } catch (error) {
       res.status(500).json(error);
    }
});  

module.exports = router;
