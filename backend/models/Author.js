import mongoose from 'mongoose';

// C'est la marque du Produit
const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Author', AuthorSchema);
