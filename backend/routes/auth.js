const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//password encryption 
const bcrypt = require('bcrypt');
const saltRounds = 10;

//register
//http://localhost:5000/api/auth/register
router.post('/register', async (req, res) => {
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    // send user to client side
    // 201 successful added
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({
        message: err.message,
      });
    } else if (err.code === 11000 && err.keyPattern.email) {
      res.status(400).json({
        message: 'Email already exists',
      });
    } else if (err.code === 11000 && err.keyPattern.username) {
      res.status(422).json({
        message: 'Username already exists',
      });
    } else {
      res.status(500).json({
        message: 'Failed to add user',
      });
    }
  }
});

//Login
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

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin
      },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    // Send user data along with access token
    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username
      },
      message: 'Login successful'
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//exports file must import in server.js
module.exports = router;
