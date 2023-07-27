import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';

//Se connecter
export const signin = async (req, res, next) => {
  //req.body contient les valeurs envoyées à la base de donnée via l'api
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    // req.body.password: mot de passe saisi par l'user dans le formulaire de connexion
    // user.password: mot de passe saisi crypté qui se trouve déja dans la BD
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid emaillll or password' });
};

//Créer un nouvel utilisateur
export const register = async (req, res, next) => {
  // On crée un nouvel utilisateur (newUser)
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8), //Son mot de passe est crypté
  });

  const user = await newUser.save(); //Le nouvel utilisateur est enregistré dans la DB

  // L'utilisateur sera connecté en même temps(cette partie est très similaire à signin)
  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
};
