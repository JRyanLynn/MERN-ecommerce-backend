const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require('./verifyToken');
const Cart = require('../models/Cart')
const router = require('express').Router();

//create
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update
router.put('/:id', verifyTokenAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            //New product in DB
            $set: req.body
        }, 
        {new: true}
        );
        res.status(200).json(updatedCart);
    }catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete('/:id', verifyTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json('Cart deleted')
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get User Cart
router.get('/find/:userId', verifyTokenAuth, async (req, res) => {
    try {
        const cart = await cart.findOne({userId: req.params.userId});
        //check security here
        res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all 
router.get('/', verifyTokenAdmin, async (req, res) => {
   try { 
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
} catch (err) {
    res.status(500).json(err);
}
})

//exports file must import in server.js
module.exports = router;