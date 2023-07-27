//Cette page Enregistre notre valeur afin qu'on puisse les réutiliser partout dans nos composants

import { createContext, useReducer } from 'react';

export const Store = createContext();

//InitialState :Ce sont les valeurs par defaut qu'ont les vatiables
// cart :(panier ici) a pour 1ere propriétes cartItems qui représente les produits ou articles

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null, //On recupère les infos actuel de l'utilisateur grace à cet initialisation de "userInfo"

  cart: {
    // On initialise aussi les données du formulaire dans le panier avec les infos qui sont dans le local storage; s'il ya rien alors l'objet est
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {},
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    // paymentMethod est déja string donc on n'a besoin de le convertir en string avec JSON.parse

    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [], //Le tableau vide: signifie que par defaut le panier est vide
    // Vu qu'on enregistre les modif articles dans le local storage (en ajout comme en supp), l'initialisation prendra tjrs ce qui est stoké la bas comme valeur initial
    // Comme ça meme si on actualise la page, les données dans le local storage seront intact et c'est eux qui seront affiché
  },
};

//Fonction reducer (Préférer à useState pour déclarer les variables, vu que cette partie est complexe)
function reducer(state, action) {
  switch (action.type) {
    //Ajouter des articles au panier
    //Si l'article n'existe pas dans le panier alors on l'ajoute; si il existe déja, alors on incéremente sa quantité
    case `CART_ADD_ITEM`:
      //add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];

      //Enregistrer les articles du panier (Après un ajout) dans le stockage local sinon à l'actualisation de la page, les articles dans le panier reviennent à zero
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      return { ...state, cart: { ...state.cart, cartItems } };

    //Supprimer un artcle du panier
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );

      //Enregistrer les articles du panier (Après une suppression) dans le stockage local sinon à l'actualisation de la page, les articles dans le panier reviennent à zero
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    //Tous les articles dans le panier seront effacés
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    // Se connecter
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    // Qd l'user se connecte,on garde l'état actuel(...state) puis on met à jour les infos de l'utilisateur en fonction des données qui viennent du backend

    // Deconnexion
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null, //Qd on se deconnecte les infos de l'user sont effacés
        cart: {
          cartItems: [], //Qd on se deconnecte, on efface tous les articles du panier
          shippingAddress: {}, //Qd on se deconnecte, on efface les infos du formulaire
          paymentMethod: '', //Qd on se deconnecte, on efface la methode de paiement
        },
      };

    // Enregister les informations qui sont dans le formalaire sur la Page ShippingAddressScreen
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
          // Ici, on ne touche pas aux artciles(les produits qu'il veut acheter) du panier, seul shipping address est enregistrer
        },
      };

    // Enregister la méthode de paiement choisi(paypal ou stripe)
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
