import express from 'express';
import {
  deleteCategory,
  getCategorys,
  getCategory,
  updateCategory,
  createCategory,
} from '../controllers/category.js';

const router = express.Router();

//Recupérer tous les produits (articles)
router.get('/list', getCategorys);

//Recupérer tous les produits (articles)
router.post('/create', createCategory);

//Recupérer un produit (article)
router.get('/read/:id', getCategory);

//Modifier un produit(article)
router.put('/update/:id', updateCategory);

//Supprimer un produit(article)
router.delete('/delete/:id', deleteCategory);

export default router;
