import express from 'express';
import {
  deleteUser,
  getUsers,
  getUser,
  updateUser,
  forgotPasswordUser,
  resetPasswordGetUser,
  resetPasswordPostUser,
} from '../controllers/user.js';
import { isAuth } from '../utils.js';

const router = express.Router();

//Recupérer tous les utilisateurs
router.get('/list', getUsers);

//Recupérer un utilisateur
router.get('/read/:id', getUser);

//Modifier un utilisateur
router.put('/updateProfile', isAuth, updateUser);

//Supprimer un utilisateur
router.delete('/delete/:id', deleteUser);

//Mot de passe oublé
router.post('/forgot-password', forgotPasswordUser);

//Mot de passe oublié (Celui ci est un get, il permet d'afficher l'émail de l'utilisateur et le formualire pour réinitailser)
router.get('/reset-password/:id/:token', resetPasswordGetUser);

//Mot de passe oublié (Formulaire qui envoie le nouveau password)
router.post('/reset-password/:id/:token', resetPasswordPostUser);

export default router;
