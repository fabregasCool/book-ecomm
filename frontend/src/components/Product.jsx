import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import { useContext } from 'react';
import { Store } from '../Store';
import axios from 'axios';
import '../style/Screens.css';

function Product(props) {
  const { product, cat, filters, sort } = props;
  // console.log(cat, filters, sort);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  //Fonction addToCartHandler (Ajouter le produit au panier)
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(
      `http://localhost:9000/api/products/read/${item._id}`
    );
    if (data.countInStock < quantity) {
      window.alert('Sorry.Product is out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <div>
      <Card>
        <Link to={`/product/${product._id}`}>
          {/* <div className="survol"> */}
          <div className="">
            <img
              src={`../../upload/${product?.img}`}
              alt={product.name}
              className="img_homescreen"
            />
          </div>
        </Link>
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title>{product?.name}</Card.Title>
          </Link>
          <Rating rating={product?.rating} numReviews={product?.numReviews} />
          <Card.Text>${product?.price}</Card.Text>
          <Card.Text>Auteur: {product?.author.name}</Card.Text>

          <Card.Text>Taille: {product?.size.name}</Card.Text>
          <Card.Text> Categorie: {product?.category?.name}</Card.Text>

          {product.countInStock === 0 ? (
            <Button variant="danger" disabled>
              Rupture de Stock
              {/* Le bouton ne s'affiche que si on a cet article en stock */}
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(product)}>
              Add to Cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
export default Product;
