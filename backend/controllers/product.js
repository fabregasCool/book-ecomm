import { createError } from '../error.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

//Recupérer tous les produits (articles) pour l'admin pour ProductListPage de admin
export const getProductsForAdmin = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort('-updatedAt')
      .populate({
        path: 'size',
        select: '',
      })
      .populate({
        path: 'category',
        select: '',
      })
      .populate({
        path: 'author',
        select: '',
      });

    res.status(200).json(products);
  } catch (err) {
    next(createError(400, 'Product Not Found '));
  }
};

//Recupérer tous les produits (articles) en fonction de la category
export const getProductsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.find({
      category: categoryId,
    })
      .populate({
        path: 'category',
        select: '',
      })
      .populate({
        path: 'author',
        select: '',
      })
      .populate({
        path: 'size',
        select: '',
      });
    console.log(products);

    res.status(200).json(products);
  } catch (err) {
    next(err);
    // res.status(501).send(err);
  }
};

//Recupérer tous les produits(article)
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .sort('-updatedAt')
      .populate({
        path: 'size',
        select: '',
      })
      .populate({
        path: 'category',
        select: '',
      })
      .populate({
        path: 'author',
        select: '',
      });

    res.status(200).json(products);
  } catch (err) {
    next(createError(400, 'Product Not Found '));
  }
};

//Recupérer un produit(article)
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'size',
        select: '',
      })
      .populate({
        path: 'category',
        select: '',
      })
      .populate({
        path: 'author',
        select: '',
      });
    res.status(200).json(product);
  } catch (err) {
    next(createError(400, 'Product Not Found '));
    // res.status(501).json(err);
  }
};

//Modifier un product
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: req.body,
      },
      { new: true } //Permet d'afficher les nouvelles valeurs
    );
    res.status(200).json(updateProduct.id + 'Modification réussie');
  } catch (err) {
    return next(createError(400, 'Un ou plusieurs champs ne sont pas rempli'));
    // res.status(501).send(err);
  }
};

//Créer un product
export const createProduct = async (req, res, next) => {
  try {
    const products = req.body;
    const product = new Product(products);
    await product.save();
    res.status(201).json('Product created');
  } catch (err) {
    console.log(err);
    return next(createError(400, 'Un ou plusieurs champs ne sont pas rempli'));
    // res.status(501).send(err);
  }
};

//Supprimer un produit(article)
export const deleteProduct = async (req, res, next) => {
  try {
    const ProductId = req.params.id;
    await Product.findByIdAndDelete(ProductId);
    res.status(200).json('Product has been deleted.');
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//Créer un reviews(qui contient name, rating,comment,user), grace à cela on fera les commentaires
export const getReviewsProduct = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id); //On retrouve le produit

  // On vérifie si l'utilisateur qui est connecté à deja donné un review à ce produit
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  // Si oui alors on affiche ce ce message
  if (alreadyReviewed) {
    // res.status(400);
    // throw new Error('Product already Reviewed');
    res.status(200).json('Product already Reviewed');
  } else {
    // Sinon on crée le review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Reviewed added' });
  }

  //
};

//Recupérer la quantité commandé mais pas achété par les clients pour un seul un article
export const qteCommmandePourUnProduct = async (req, res, next) => {
  try {
    var TableauDesQuantites = [];
    var SumDesQuantites = 0;
    const orders = await Order.find();
    const ProductId = req.params.productId;
    console.log("Id du produit dans l'url " + ProductId);
    for (let index = 0; index < orders.length; index++) {
      const CurrentOrder = orders[index];
      //console.log(CurrentOrder);

      for (let index = 0; index < CurrentOrder.orderItems.length; index++) {
        const OrdersByIteration = CurrentOrder.orderItems[index];
        console.log('OrdresItems par itération' + OrdersByIteration);
        console.log(OrdersByIteration._id.toHexString());

        if (ProductId === OrdersByIteration._id.toHexString()) {
          console.log('Quantité par itération ' + OrdersByIteration.quantity);
          TableauDesQuantites.push(OrdersByIteration.quantity); //On ajoute la note à l'élève
          console.log('TableauDesQuantites' + TableauDesQuantites);
        }
      }
    }
    //On fait une boucle sur le tableau et on additionne tout car on cherche: Somme (Note X Coeff)
    for (let index = 0; index < TableauDesQuantites.length; index++) {
      SumDesQuantites += TableauDesQuantites[index];
      console.log('Somme des Quantités' + SumDesQuantites);
    }

    res.status(200).json(SumDesQuantites);
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};

//Recupérer la quantité commandé mais pas achété par les clients pour un seul un article
export const qteCommmandePourUnProductEtPaye = async (req, res, next) => {
  try {
    var TableauDesQuantites = [];
    var SumDesQuantites = 0;
    const orders = await Order.find({ isPaid: true });
    const ProductId = req.params.productId;
    console.log("Id du produit dans l'url " + ProductId);
    for (let index = 0; index < orders.length; index++) {
      const CurrentOrder = orders[index];
      //console.log(CurrentOrder);

      for (let index = 0; index < CurrentOrder.orderItems.length; index++) {
        const OrdersByIteration = CurrentOrder.orderItems[index];
        console.log('OrdresItems par itération' + OrdersByIteration);
        console.log(OrdersByIteration._id.toHexString());

        if (ProductId === OrdersByIteration._id.toHexString()) {
          console.log('Quantité par itération ' + OrdersByIteration.quantity);
          TableauDesQuantites.push(OrdersByIteration.quantity); //On ajoute la note à l'élève
          console.log('TableauDesQuantites' + TableauDesQuantites);
        }
      }
    }
    //On fait une boucle sur le tableau et on additionne tout car on cherche: Somme (Note X Coeff)
    for (let index = 0; index < TableauDesQuantites.length; index++) {
      SumDesQuantites += TableauDesQuantites[index];
      console.log('Somme des Quantités' + SumDesQuantites);
    }

    res.status(200).json(SumDesQuantites);
  } catch (err) {
    next(err);
    res.status(501).json(err);
  }
};
