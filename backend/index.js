import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import sizeRoutes from './routes/sizes.js';
import categoryRoutes from './routes/categorys.js';
import authorRoutes from './routes/authors.js';

import cookieParser from 'cookie-parser';
import multer from 'multer';

//Création de l'application express
const app = express();

//Configuration de dotenv
dotenv.config();

//Configuration afin de pouvoir accepeter les fichiers JSON
app.use(express.json());

// app.use(express.limit('220M'));
// Il permet de laisser passer les infos venant de ejs
app.use(express.urlencoded({ extended: false }));

//Template ejs permettant de créer les interfaces html, css et js etant toujours dans le backend
app.set('view engine', 'ejs');

//Notre cookieParser
app.use(cookieParser());

//Code à ajouter à cors pour laisser passer les cookies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Configuration Cors par defaut
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
// Ce code permet de laisser passer les boutons paypal
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

//Connexion Paypal (Cette route renvoie ou retourne le clientId (PAYPAL_CLIENT_ID) qui se trouve dans le fichier env)
app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

//Fin de la config cors
//Fin de la config cors

//MULTER ET SES CONFIGURATIONS

//CODE SI ON UTILISE L'OPTION "DESTINATION" : 1ère option mais trop limitée
// const upload = multer({ dest: "uploads/" }); //"uploads designe le fichier où seront enregistrer nos fichiers téléchargés"
// app.post("/api/upload", upload.single("file"), function (req, res) {
//   res.status(200).json("Image has been uploaded");
// });

// Utilisation de la seconde option:  Storage(Stockage) au lieu de destination (qui est en commentaire juste au dessus)

//Grace à multer et ce code ci-dessous, on stocke les images et vidéos dans le dossier:"client/public/upload"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/upload'); //chemin du dossier qui va recevoir nos images (on le crée nous même)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
    //file.originalname: recupère le nom de l'image;
    //Si ns téléchargeons la même image avec le meme nom, le 2nd va écraser le 1er
    //Pour éviter cela on ajoute la date(Date.now() )
  },
});

const upload = multer({ storage: storage });
// //CREATION DE NOTRE REQUETE

app.post('/api/upload', upload.single('file'), function (req, res) {
  //"/api/upload": designe notre route, on peut ce qu'on veut
  //upload: c'est la variable qui est crér grace à "multer" en haut
  //single: tous les fichiers télechrgés seront dans un seul fichier
  //file: le nom de ce fichier est "file" que nous utiliserons dans "write.js"

  const file = req.file;
  res.status(200).json(file?.filename); //on recupère l'URL(nom_de_fichier + extension) de l'image
});

//Connect to the database
mongoose.set('strictQuery', false); //Se preparer aux erreur de Mongoose 7
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to backend .');
    console.log('Connected to Mongoose');
  }
);

//Après la l'importation du haut, on peut les utiliser ici
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sizes', sizeRoutes);
app.use('/api/categorys', categoryRoutes);
app.use('/api/authors', authorRoutes);

//Middleware Gestion des erreurs dont on a parlé dans "/controllers/auth" en Commentaire
//Apres cette config,nous pouvopns l'utiliser partout dans nos "Controllers"

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Quelque chose s'est mal passé";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

//Start the server
app.listen(process.env.PORT);

// app.listen(1111, () => {
//   console.log("Connected to backend.");
// });

//NB:
//-Connexion à la base de Données
//-Créer la base de données dans Robot 3T aisni que nos collections(Comme pour workbench et les tables)
