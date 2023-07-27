import express from 'express';
import {
  deleteOrder,
  getOrders,
  getOrder,
  updateOrder,
  createOrder,
  allOrdersOfTheUser,
  SumPriceOrders,
  PayOrder,
  totalVentesOrders,
  nbreorderssoldes,
} from '../controllers/order.js';
import { isAuth } from '../utils.js';

const router = express.Router();

//Recupérer toutes commandes
router.get('/list', getOrders);

//Crée une commande
//isAuth (Verifie si l'utilisateur est authentifié (relié à user qui se trouve dans cette route))
router.post('/create', isAuth, createOrder);

//Recupérer une commande
//isAuth (Verifie si l'utilisateur est authentifié (relié à user qui se trouve dans cette route))
router.get('/read/:id', isAuth, getOrder);

//Modifier une commande
router.put('/update/:id', updateOrder);

//Supprimer une commande
router.delete('/delete/:id', deleteOrder);

//(Recupère toutes  les commandes de l'utilisateur connecté)
router.get('/allOrdersOfTheUser', isAuth, allOrdersOfTheUser);

//Recupérer la somme de toutes les commandes
router.get('/sumPriceOrders', SumPriceOrders);

//Recupérer la somme de toutes les commandes qui ont été soldés (En fait c'est la somme des ventes)
router.get('/totalVentesOrders', totalVentesOrders);

//Recupérer et renvoie le nombre de commandes qui on été soldés par les clients
router.get('/nbreorderssoldes', nbreorderssoldes);

//Effectuer le paiement avec Paypal
router.put('/:id/pay', isAuth, PayOrder);

export default router;
