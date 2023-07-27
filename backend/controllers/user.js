import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { generateToken } from '../utils.js';
import { createError } from '../error.js';

//Recupérer tous les utilisateurs
export const getUsers = async (req, res, next) => {
  try {
    const user = await User.find().sort('-updatedAt');
    res.status(200).json(user);
  } catch (err) {
    next(err);
    // res.status(501).json(err);
  }
};

//Recupérer un utilisateur
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
    // res.status(501).json(err);
  }
};

//Modifier un utilisateur
export const updateUser = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not found' });
  }
};

//Supprimer un utilisateur
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json('User has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//Mot de passe oublié (Grace à cette route, on envoie le mail dans la boite de l'utilisateur)
export const forgotPasswordUser = async (req, res, next) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email }); //On recherche l'utilisateur ds la BD grace au mail qu'il a rentré
    //console.log(oldUser);

    // Voyons si cet utilisateur existe dans la BD
    if (!oldUser) {
      // return res.send("Cet Utilisateur n'existe pas!");
      return next(createError(400, "Cet Utilisateur n'existe pas"));
    }
    // Si l'user existe alors:
    else {
      const secret = process.env.JWT_SECRET + oldUser.password; //on cree une variable combinant JWT_SECRET et l'ancien mot de passe

      // Ensuite on crée un token contenat le mail et le id de l'utilisateur, il s'expire après 5 min
      const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
        expiresIn: '10m',
      });

      const link = `http://localhost:9000/api/users/reset-password/${oldUser._id}/${token}`; //C'est ce lien qu'on envoi dans la boite mail

      // NodeMailer
      var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'admin@gmail.com', //Email Admin
          pass: '0000', //Mot de passe de l'email Admin
        },
      });

      var mailOptions = {
        from: 'admin@gmail.com', //Email Admin
        to: oldUser.email, //Le mail qui reçoit le lien pour réinitialiser le mot de passe
        subject: 'Password Reseet',
        text: link, //Le lien envoyé
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log(link);
    }
    res.send("L'utilsateur est:" + oldUser);
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//Mot de passe oublié (Celui ci est un get, il permet d'afficher l'émail de l'utilisateur et le formualire pour réinitailser)
export const resetPasswordGetUser = async (req, res, next) => {
  const { id, token } = req.params;
  //console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return next(createError(400, "Cet Utilisateur n'existe pas"));
  } else {
    const secret = process.env.JWT_SECRET + oldUser.password;

    // On vérifie si "secret" est valide
    try {
      const verify = jwt.verify(token, secret);
      res.render('index', { email: verify.email, status: 'verified' });
    } catch (error) {
      console.log(error);
      res.send('Not Verified');
    }
  }
};

//Mot de passe oublié (Formulaire qui envoie le nouveau password)
export const resetPasswordPostUser = async (req, res, next) => {
  const { id, token } = req.params;

  const { password, confirm_password } = req.body; //On recupère les champs saisi par le user

  // On exécute le code à condition que les 2 mots de passe soient identique
  if (password === confirm_password) {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.send('User Not Exists!');
    } else {
      const secret = process.env.JWT_SECRET + oldUser.password;

      try {
        const verify = jwt.verify(token, secret);
        const encryptPassword = await bcrypt.hashSync(password, 8);
        await User.updateOne(
          {
            _id: id,
          },
          {
            $set: {
              password: encryptPassword,
            },
          }
        );
        res.send('Bravo!!! La mise à jour du mot de passe est un succès');

        // index: c'est index.ejs (ejs est un template qui nous permet de créer une page html,css et js etant sur nodejs)
        res.render('index', { email: verify.email, status: 'verified' });
      } catch (error) {
        console.log(error);
        res.send("Quelque chose s'est mal passé");
        //app.use(express.urlencoded({ extended: false })); Si il y a erreur,Ecrire cette ligne dans index.js
      }
    }
  } else {
    return next(createError(400, 'Les deux mots de passes sont différents '));
    // res.send('Les deux mots de passes sont différents');
  }
};
