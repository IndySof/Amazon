import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from '../utils.js';




const orderRouter = express.Router();
orderRouter.get(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};

    const orders = await Order.find({ ...sellerFilter }).populate(
      'user',
      'name'
    );
    res.send(orders);
  })
);

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);



var founded = false;
var alphabet = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// lettre aléatoire entre 1 et 25
var random1 = Math.ceil(Math.random() * 25);
var random2 = Math.ceil(Math.random() * 25);
var random3 = Math.ceil(Math.random() * 25);
var random4 = Math.ceil(Math.random() * 25);
// on recupere une entrée aléatoire du tableau
var l1 = alphabet[random1];
var l2 = alphabet[random2];
var l3 = alphabet[random3];
var l4 = alphabet[random4];
var la = l1 + l2 + l3

function numeroSuivi() {
  if (Order.suivi) {
    
    return "LR500"+ Math.random(['A', 'Z']) + l2 + l3 + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) + l4;
  }
  else{
    return "LR500"+ alphabet[Math.ceil(Math.random() * 25)] + alphabet[Math.ceil(Math.random() * 25)] + alphabet[Math.ceil(Math.random() * 25)] + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) + alphabet[Math.ceil(Math.random() * 25)];    
  };
};

function code1() {
  if (Order.sec1) {
    
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }
  else{
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    
  };
};

function code2() {
  if (Order.seq2) {
    
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1) || seq1;
  }
  else{
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    
  };
};

console.log(numeroSuivi());
console.log(numeroSuivi());
console.log(numeroSuivi());
console.log(numeroSuivi());
console.log(code1());
console.log(code2());







orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Le panier est vide' });
    } else {
      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
        suivi: numeroSuivi(),
        sec1: code1(),
        sec2: code2(),
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'Commande creee', order: createdOrder });
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Commande non trouvee' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazoning921 <projetamazing921@gmail.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `Nouvelle commande ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: 'Commande payee', order: updatedOrder });
    } else {
      
      res.status(404).send({ message: 'Commande non trouvee' });
    }
  })
);

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Commande supprimee', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Commande non trouvee' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Commande livree', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Commande non trouvee' });
    }
  })
);

export default orderRouter;
