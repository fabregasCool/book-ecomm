import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    // Informations sur l'article commandée
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        img: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        // Il fait reference au model Product, on lie les deux collections
      },
    ],
    // Les informations du formulaire shippingAddress
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    // Methode de Paiement
    paymentMethod: { type: String, required: true },

    // Resulats des paiements
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_Address: String,
    },

    // Les différents prix calculés
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // Utilisateur qui a créer la commande
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Autres
    isPaid: { type: Boolean, default: false }, //a été payé
    paidAt: { type: Date }, //Date de paiement
    isDelivered: { type: Boolean, default: false }, //produit livrée
    deliveredAt: { type: Date }, //date de livraison
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Order', OrderSchema);
