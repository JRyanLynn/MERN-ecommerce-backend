const router = require('express').Router();
const User = require('../models/User');
const {verifyToken, verifyTokenAuth, verifyTokenAdmin} = require('./verifyToken');

//Post to create new user is in auth.js file
//Route is http://localhost:5000/api/auth/register

//update
//localhost:5000/api/users/id
router.put('/:id', verifyTokenAuth, async (req, res) => {
    //check PW + encrypt PW
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    }
    try {
        const updatedUser =await User.findByIdAndUpdate(req.params.id, {
            //New password in DB
            $set: req.body
        }, 
        {new: true}
        );
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete
router.delete('/:id', verifyTokenAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User deleted')
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get User
//localhost:5000/api/users/find/id
router.get('/find/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //check security here
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get All Users
//localhost:5000/api/users
//New Users localhost:5000/api/users?new=true
router.get('/', verifyTokenAdmin, async (req, res) => {
    //gets new users
    const query = req.query.new;
    try {
        //gets 5 newest users or all users
        const users = query 
        ? await User.find().sort({_id: -1}).limit(5) 
        : await User.find();
        //check security here
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get user stats
//localhost:5000/api/users/stats
//id is the month number like 9 for sept
router.get('/stats', verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    //last full year
    const lastYear =  new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        //monthly breakdown
        const data = await User.aggregate ([
            //created at greater than last year
            {$match: {createdAt: {$gte: lastYear}}},
            //breakdown of users by month
            {$project: {month: {$month: "$createdAt"}},},
            //grouped users by month and sum of all users 
            {$group: { _id: '$month', total: {$sum: 1}}},
        ])
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

//exports file must import in server.js
module.exports = router;