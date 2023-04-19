const router = require('express').Router();
const Product = require('../models/Product');
const {verifyToken, verifyTokenAuth, verifyTokenAdmin} = require('./verifyToken');

//create (post new product)
//http://localhost:5000/api/products (need barer token)
router.post('/', verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err)
    }
});

//Update product 
router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const updatedProduct =await Product.findByIdAndUpdate(req.params.id, {
            //New product in DB
            $set: req.body
        }, 
        {new: true}
        );
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete
router.delete('./:id', verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json('Product deleted')
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get Product
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        //check security here
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get all products
//All products localhost:5000/api/products
//New Products localhost:5000/api/products?new=true
router.get('/', async (req, res) => {
    //gets new products
    const query = req.query.new;
    //can add more here as needed using things like category
    try {
        let products;
        if (query) {
        //5 newest products
        products = await Product.find().sort({createdAt: -1}).limit(5);
        } else {
            products = await Product.find();
        }       
        //check security here
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

//product stats go here as a get request

//exports file must import in server.js
module.exports = router;