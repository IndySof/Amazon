import mongoose from 'mongoose';

// var alphabet = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
// var random1 = Math.ceil(Math.random() * 25);
// var random2 = Math.ceil(Math.random() * 25);
// var random3 = Math.ceil(Math.random() * 25);
// var random4 = Math.ceil(Math.random() * 25);
// var l1 = alphabet[random1];
// var l2 = alphabet[random2];
// var l3 = alphabet[random3];
// var l4 = alphabet[random4];
// var la = l1 + l2 + l3
// var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
// var seq1 = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
// var seq2 = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

// const numSuivi = "LR500" + la + seq2 + l4

// function generate(count) {
//     var founded = false,
//         _sym = '"LR500"+ la + seq2 + l4',
//         str = '';
//     while (!founded) {
//         for (var i = 0; i < count; i++) {
//             str += _sym[parseInt(Math.random() * (_sym.length))];
//         }
//         base.getID(string, function (err, res) {
//             if (!res.length) {
//                 founded = true; 
//             }
//         });
//     }
//     return str;
// };

// console.log("Numero de suivi :");
// console.log(numSuivi);




const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      lat: Number,
      lng: Number,
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectID, ref: 'User', required: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    isPaid: { type: Boolean, default: true },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    suivi: { type: String, required: true},
    sec1: { type: String, required: true},
    sec2: { type: String, required: true},
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model('Order', orderSchema);
export default Order;
