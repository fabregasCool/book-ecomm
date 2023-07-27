import express from 'express';
import {
  deleteProduct,
  getProducts,
  getProductsForAdmin,
  getProduct,
  updateProduct,
  createProduct,
  getReviewsProduct,
  getProductsByCategory,
  qteCommmandePourUnProduct,
  qteCommmandePourUnProductEtPaye,
  // getSearchProduct,
} from '../controllers/product.js';
import { isAuth } from '../utils.js';

const router = express.Router();

//Recupérer tous les produits (articles) pour l'admin (qd je prends celui d'en bas, vu les modif concernant les pages cela n'affiche pas tous les produits)
router.get('/listforAdmin', getProductsForAdmin);

//Recupérer tous les produits (articles)
router.get('/list', getProducts);

//Recupérer tous les produits (articles)
router.post('/create', createProduct);

//Recupérer un produit (article)
router.get('/read/:id', getProduct);

//Modifier un produit(article)
router.put('/update/:id', updateProduct);

//Supprimer un produit(article)
router.delete('/delete/:id', deleteProduct);

//Créer un reviews(qui contient name, rating,comment,user), grace à cela on fera les commentaires
router.post('/:id/review', isAuth, getReviewsProduct);

//Recupérer Les Produits par catégory
router.get('/getProductsByCategory/:categoryId', getProductsByCategory);

//Rechercher un produit
router.get('/qteCommmandePourUnProduct/:productId', qteCommmandePourUnProduct);

//Rechercher un produit
router.get(
  '/qteCommmandePourUnProductEtPaye/:productId',
  qteCommmandePourUnProductEtPaye
);

//Rechercher un produit
// router.get('/search', getSearchProduct);

export default router;
