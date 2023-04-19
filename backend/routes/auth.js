const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

//register
router.post('/register', async (req, res) => {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const hashedEmail = await bcrypt.hash(req.body.email, saltRounds);

    const newUser = new User({
        username: req.body.username,
        email: hashedEmail,
        password: hashedPassword,
    })
    //need await/promise to buffer response
    try {
        const savedUser = await newUser.save();
        //send user to client side
        //201 successful added
        res.status(201).json(savedUser);
    } catch (err) {
        //need specific error for failed to add user here
        res.status(500).json(err)
    }
})

//Login

//used bcrypt compare to decrypt and check PW
router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(400).send('Username not found');
      }
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
      }

       //json web token 
       const accessToken = jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
      }, process.env.JWT_KEY, 
      {expiresIn: '1d'}
      );

      res.status(200).json({accessToken, message: 'Login successful'});
    } catch (err) {
      res.status(500).json(err);
    }
  }); 

//exports file must import in server.js
module.exports = router;
