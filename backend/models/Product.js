import mongoose from 'mongoose';

const reviewsSchema = mongoose.Schema(
  {
    // En gros ce tableau contient les commentaires des clients sur ce produit
    name: {
      type: String,
      // required: true,
    },
    rating: {
      type: Number,
      // required: true,
      //Estimation, ce sont les étoiles que choisit le client quand il a commenté
    },
    comment: {
      type: String,
      // required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema(
  {
    reviews: [reviewsSchema], //Ce tableau est defini en haut, il contient(un nom, des étoiles,un commentaire et l'utilisateur qui est à l'origine)
    name: {
      type: String,
      required: true,
      unique: true,
    },
    book: {
      type: String,
      // required: true,
    },
    img: {
      type: String,
      // required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
      // required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      // required: true,
      // Estimation, ce sont les étoiles (la moyenne des évalations des clents sur le produit)
    },
    numReviews: {
      type: Number,
      //required: true,
      //nombre d'évaluations(le nbre de personnes qui ont acheté et évalué le produit)
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Product', ProductSchema);
