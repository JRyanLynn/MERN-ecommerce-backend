const router = require('express').Router();
const Order = require('../models/Order');
const { verifyToken, verifyTokenAuth, verifyTokenAdmin } = require('./verifyToken');

//create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//update
router.put('/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            //New product in DB
            $set: req.body
        }, 
        {new: true}
        );
        res.status(200).json(updatedOrder);
    }catch(err){
        res.status(500).json(err);
    }
});

//Delete
router.delete('/:id', verifyTokenAuth, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order deleted')
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get User Orders
router.get('/find/:userId', verifyTokenAuth, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId});
        //check security here
        res.status(200).json(orders)
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
});

//Get monthly income
router.get('/income', verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    //income in the past month
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth() -1));

    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: previousMonth}}},
            {$project: {
                month: {$month: '$createdAt'},
                sales: '$amount',
            },
        },

    {$group: {
        _id: '$month',
        total: {$sum: '$sales'},
    },
},
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

//exports file must import in server.js
module.exports = router;
