const mongoose = require('mongoose');

const Reviews = new mongoose.Schema ({
    id: {type: Number, required: true},
    date: {type: Date, required: true, default: Date.now},
    review: {type: String, required: true},
    username: {type: String, required: true},
    rating: {type: Number, required: true}
});

module.exports = mongoose.model('Reviews', Reviews);

