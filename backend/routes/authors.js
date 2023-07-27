import express from 'express';
import {
  deleteAuthor,
  getAuthors,
  getAuthor,
  updateAuthor,
  createAuthor,
} from '../controllers/author.js';

const router = express.Router();

//Recupérer tous les tailles
router.get('/list', getAuthors);

//Recupérer tous les tailles
router.post('/create', createAuthor);

//Recupérer un taille (article)
router.get('/read/:id', getAuthor);

//Modifier un taille(article)
router.put('/update/:id', updateAuthor);

//Supprimer un taille(article)
router.delete('/delete/:id', deleteAuthor);

export default router;
