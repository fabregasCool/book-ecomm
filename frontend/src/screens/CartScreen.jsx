import { useContext } from 'react';
import axios from 'axios';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

import '../style/Screens.css';
import {
  PatchMinusFill,
  PatchPlusFill,
  TrashFill,
} from 'react-bootstrap-icons';

export default function CartScreen() {
  // useNavigate
  const navigate = useNavigate();

  //  cart: { cartItems }: on doit lister les articles (cartItems) qui sont dans le panier (cart)
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  //Fonction updateCartHandler (Permet d'incrémenter ou décrementer un article)
  const updateCartHandler = async (item, quantity) => {
    // item:désigne l'élément (l'article) qu'on doit mettre à jour
    const { data } = await axios.get(
      `http://localhost:9000/api/products/read/${item._id}`
    );
    console.log(data);
    // si la quantité en stock est épuisé alors on affiche ce message
    if (data.countInStock < quantity) {
      window.alert('Sorry.Product is out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  //Fonction removeItemHandler (Supprimer un article)
  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  //Fopnction checkoutHandler (On est dirigé vers la page de connexion)
  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
    // Cela signifie qu'on verifie l'authetification de l'user
    //Si l'user est authentifié alors il est dirigé vers la page de "shipping" sinon il est redirigé vers "signin" qui est la page pour se connecter
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Container>
        <h1>Shopping Cart</h1>
        <Row>
          {/* Liste des articles */}
          <Col md={8}>
            {/* Si les articles dans le panier est nul alors on affiche  Cart is empty. */}
            {cartItems.length === 0 ? (
              <MessageBox>
                Cart is empty. <Link to="/">Go Shopping</Link>
              </MessageBox>
            ) : (
              // Le cas où le panier  n'est pas vide, on affiche la liste des articles
              <ListGroup>
                {cartItems.map((item) => (
                  <ListGroupItem key={item._id}>
                    <Row className="align-items-center">
                      {/* Image de l'article ou cartItems */}
                      <Col md={3}>
                        <div className="">
                          <img
                            src={`../../upload/${item?.img}`}
                            alt={item?.name}
                            className="rounded-1 img_thumbnail"
                          />
                        </div>
                        <p>
                          <Link to={`/${item._id}`}>{item.name}</Link>{' '}
                        </p>
                      </Col>

                      {/* Boutons pour Diminuer ou augmenter le nombre d'articles */}
                      <Col md={3}>
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          variant="light"
                          disabled={item.quantity === 1}
                          //   Bouton décremente
                        >
                          <PatchMinusFill
                            color="#000"
                            size={30}
                            className=" my-2 "
                          />
                        </Button>{' '}
                        <span> {item.quantity}</span>{' '}
                        <Button
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          variant="light"
                          disabled={item.quantity === item.countInStock}
                          //    Bouton incrementer
                        >
                          <PatchPlusFill
                            color="#000"
                            size={30}
                            className=" my-2 "
                          />
                        </Button>{' '}
                      </Col>

                      {/* Prix de l'article */}
                      <Col md={3}>${item.price}</Col>

                      {/* Icone pour supprimer */}
                      <Col md={2}>
                        <Button
                          variant="light"
                          onClick={() => removeItemHandler(item)}
                        >
                          <TrashFill
                            color="#000"
                            size={30}
                            className=" my-2 "
                          />
                        </Button>{' '}
                      </Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </Col>

          {/* Affiche le nombre d'article dans le panier et un bouton pour l'achat */}
          <Col md={4}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroupItem>
                    <h3>
                      SubTotal({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                      item ):$
                      {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                    </h3>
                  </ListGroupItem>
                  <ListGroupItem>
                    {/* Bouton qui redirige sur la page de connexion s'il n'est pas encore connecté */}
                    <div className="d-grid">
                      {/* d-grid: agrandi le bouton */}
                      <Button
                        onClick={checkoutHandler}
                        type="button"
                        variant="primary"
                        disabled={cartItems.length === 0}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
