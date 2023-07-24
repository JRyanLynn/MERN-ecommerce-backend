const express = require('express');
const mongoose =  require('mongoose');
const dotenv = require('dotenv').config();
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const userRoute = require('./routes/user');
const reviewRoute = require('./routes/reviews');
const stripe = require('./routes/stripe');

//{origin: true}
const cors = require("cors");

//gets express server running
const app = express();

//promise to connect mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB connection success'))
    .catch((err) => {
        console.log(err)
    }) 

app.use(express.json());

//Allows other servers to connect. Might not need Origin: true
app.use(cors({
    origin: '*',
}));

//authenticate users
app.use('/api/auth', authRoute);

//stripe from stripe.js
app.use('/api/stripe', stripe);

//user route
app.use('/api/users', userRoute);

//products
app.use('/api/products', productRoute);

//cart
app.use('/api/carts', cartRoute);

//order
app.use('/api/orders', orderRoute);

//reviews
app.use('/api/reviews', reviewRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log('backend server running')
})