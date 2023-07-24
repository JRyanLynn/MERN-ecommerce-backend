const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
      userId: { type: String, required: true },
      products: [
        {
          id: { type: String},
          name: { type: String, required: true },
          image: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, default: 0 },
        },
      ],
    },
    { timestamps: true },
  );
  
module.exports = mongoose.model('Cart', CartSchema);