import express from 'express';
import {
  deleteSize,
  getSizes,
  getSize,
  updateSize,
  createSize,
} from '../controllers/size.js';

const router = express.Router();

//Recupérer tous les tailles
router.get('/list', getSizes);

//Recupérer tous les tailles
router.post('/create', createSize);

//Recupérer un taille
router.get('/read/:id', getSize);

//Modifier un taille
router.put('/update/:id', updateSize);

//Supprimer un taille
router.delete('/delete/:id', deleteSize);

export default router;
