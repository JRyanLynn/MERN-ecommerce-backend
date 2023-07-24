const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require('./verifyToken');
const Cart = require('../models/Cart')
const router = require('express').Router();

//create
router.post('/', verifyToken, async (req, res) => {
    const { userId, products } = req.body;
  
    try {
      let cart = await Cart.findOne({ userId });
  
      if (cart) {
        // Check if any items are removed from the cart
        const updatedProducts = [];
        for (const existingProduct of cart.products) {
          const product = products.find((p) => p.id === existingProduct.id);
          if (product) {
            // Update quantity if product exists in the request
            existingProduct.quantity += product.quantity;
            updatedProducts.push(existingProduct);
          }
        }
  
        cart.products = updatedProducts;
  
        // Add new products to the cart
        const newProducts = products.filter(
          (product) =>
            !cart.products.some((p) => p.id === product.id)
        );
        cart.products.push(...newProducts);
  
        cart = await cart.save();
        res.status(200).json(cart);
      } else {
        // Cart does not exist for the user, create a new cart
        const newCart = new Cart({ userId, products });
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
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
router.get('/find/:userId', verifyToken, async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      // check security here
      res.status(200).json(cart);
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