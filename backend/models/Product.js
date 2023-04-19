const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    productNumber: { type: Number, required: true, unique: true },
    image: { type: String, required: true },
    wholesale: { type: Number, required: true },
    price: { type: Number, required: true },
    dimensions: { type: String},
    category: { type: String, required: true },
    type: { type: String, required: true },
    care: { type: String, required: true },
    light: { type: String, required: true },
    water: { type: String, required: true },
    environment: { type: String},
    quantity: { type: Number, required: true },
    sold: { type: Number},
    saleFrequency: { type: Number},
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);

