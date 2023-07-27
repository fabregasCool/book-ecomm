import { createError } from '../error.js';
import Order from '../models/Order.js';

//Recupérer toutes les  commandes
export const getOrders = async (req, res, next) => {
  try {
    const order = await Order.find().sort('-updatedAt').populate({
      path: 'user',
      select: '',
    });

    res.status(200).json(order);
  } catch (err) {
    next(createError(400, 'Order Not Found '));
  }
};

//Recupérer une commande
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'book',
      },
    });
    res.status(200).json(order);
  } catch (err) {
    next(createError(400, 'Order Not Found '));
    // res.status(501).json(err);
  }
};

//Modifier un order
export const updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const updateOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: req.body,
      },
      { new: true } //Permet d'afficher les nouvelles valeurs
    );
    res.status(200).json(updateOrder.id + 'Modification réussie');
  } catch (err) {
    next(err);
    // res.status(501).send(err);
  }
};

//Créer un order (une commande)
export const createOrder = async (req, res, next) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })), //On fait une boucle car on peut avoir plusieurs produits selectionnés par le client
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    itemsPrice: req.body.itemsPrice,
    shippingPrice: req.body.shippingPrice,
    taxPrice: req.body.taxPrice,
    totalPrice: req.body.totalPrice,
    user: req.user._id, //On a pas cette valeur, voila pourquoi, on crée isAuth (Cela crée encore plus de sécurité à mon appli)
  });

  //   Enregistrer la commande
  const order = await newOrder.save();

  res.status(201).send({ message: 'New Order Created', order });
};

//Supprimer une commande
export const deleteOrder = async (req, res, next) => {
  try {
    const OrderId = req.params.id;
    await Order.findByIdAndDelete(OrderId);
    res.status(200).json('Order has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//(Recupère toutes  les commandes de l'utilisateur connecté)
export const allOrdersOfTheUser = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

//Recupérer la somme de toutes les commandes
export const SumPriceOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    var SumtotalPrice = 0;
    var TotalPriceTable = [];
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];

      console.log(element.totalPrice);
      TotalPriceTable.push(element.totalPrice);

      console.log('Tableau contenant les prix' + TotalPriceTable);
    }

    for (let index = 0; index < TotalPriceTable.length; index++) {
      SumtotalPrice += TotalPriceTable[index];
      console.log(SumtotalPrice);
    }
    //On fait une boucle sur le tableau et on additionne tout car on cherche: Somme (Note X Coeff)

    res.status(200).json(SumtotalPrice);
  } catch (err) {
    next(createError(400, 'Order Not Found '));
  }
};

//Recupérer la somme de toutes les commandes qui ont été soldés (En fait c'est la somme des ventes)
export const totalVentesOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ isPaid: true });

    var SumtotalPrice = 0;
    var TotalPriceTable = [];
    for (let index = 0; index < orders.length; index++) {
      const element = orders[index];

      console.log(element.totalPrice);
      TotalPriceTable.push(element.totalPrice);

      console.log('Tableau contenant les prix' + TotalPriceTable);
    }

    for (let index = 0; index < TotalPriceTable.length; index++) {
      SumtotalPrice += TotalPriceTable[index];
      console.log(SumtotalPrice);
    }
    //On fait une boucle sur le tableau et on additionne tout car on cherche: Somme (Note X Coeff)

    res.status(200).json(SumtotalPrice);
  } catch (err) {
    next(createError(400, 'Order Not Found '));
  }
};

//Recupérer et renvoie le nombre de commandes qui on été soldés par les clients
export const nbreorderssoldes = async (req, res, next) => {
  try {
    const orders = await Order.find({ isPaid: true });
    console.log(orders);

    res.status(200).json(orders.length);
  } catch (err) {
    next(createError(400, 'Order Not Found '));
  }
};

//Effectuer le paiement avec Paypal
export const PayOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_Address: req.body.email_Address,
    };
    const updateOrder = await order.save();
    res.send({ message: 'Order Paid', order: updateOrder });
  } else {
    res.status(404).send({ message: 'Order Not found' });
  }
};
