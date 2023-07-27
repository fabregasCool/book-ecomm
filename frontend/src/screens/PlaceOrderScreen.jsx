import React, { useContext, useEffect, useReducer } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

//reducer pour la fonction placeOrderHandler
const reducer = (state, action) => {
  switch (action.type) {
    // Action de Creer une commande
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    // Le cas où la requête est un succes
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    // Le cas où la requête est un échec
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const navigate = useNavigate();

  //  C'est pour le placeOrderHandler qu'on utilise le hook useReducer
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  //Fonction arrondi
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; //123.2345==123.23

  //Calculate itemsPrice
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );

  //Calculate shippingPrice
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);

  //Calculate taxPrice (Un peu comme TVA mais ici 15%)
  cart.taxPrice = round2(0.15 * cart.itemsPrice);

  //Calculate totalPrice
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  //Fonction placeOrderHandler (Bouton qui crée la commande et l'envoi au backend pour enregistrement)
  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `http://localhost:9000/api/orders/create`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
          //headers: 2nd param de axios: on lui passe des options (authorization)
          //   la valeur de cette barrière avt qu'il passe est notre token
          // Avec cette option, cette Api est authentifié, et dans le backend, je peux détecter si
          // la demande provient d'un utilisateur connecté ou d'un pirate informatique
        }
      );
      ctxDispatch({ type: 'CART_CLEAR' }); //Après cette requête, on vide le panier de tous les articles(CART_CLEAR); cette action est réalisé dans le Store
      dispatch({ type: 'CREATE_SUCCESS' }); //Action si la requête est un succès
      localStorage.removeItem('cartItems'); //Effacer les artcles du panier car on aura deja passer la commande puis l'envoyé au backend; on a donc plus besoin de ces données dans le local storage
      navigate(`/order/${data.order._id}`); //On dirige l'utilisateur sur la page de cette commande
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  //UseEffect(S'il n'avait pa chosi une methode de paiement, alors il est redirigé vers cette page)
  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart, navigate]);
  return (
    <div>
      <div className="container small-container">
        <Helmet>
          <title> Preview Order</title>
        </Helmet>
        <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
        <h1 className="my-3"> Preview Order</h1>
        <Row>
          <Col md={8}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Shipping</Card.Title>
                {/* ShippingAddress Part */}
                <Card.Text>
                  <strong>Name: </strong>
                  {cart.shippingAddress.fullName}
                  <br />
                  <strong>Address: </strong>
                  {cart.shippingAddress.address},{cart.shippingAddress.city},
                  {cart.shippingAddress.postalCode},
                  {cart.shippingAddress.country},
                </Card.Text>

                <Link to="/shipping">Edit</Link>
              </Card.Body>
            </Card>

            {/* Payment Part */}
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Payment</Card.Title>
                <Card.Text>
                  <strong>Method: </strong>
                  {cart.paymentMethod},
                </Card.Text>
                <Link to="/payment">Edit</Link>
              </Card.Body>
            </Card>

            {/* Product Part */}
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Items</Card.Title>
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        {/* Image de l'article */}
                        <Col md={6}>
                          <h3>
                            <Badge bg="success">Image</Badge>
                          </h3>
                          <div className="">
                            <img
                              src={`../../upload/${item?.img}`}
                              alt={item?.name}
                              className="rounded-1 img_thumbnail"
                            />
                          </div>
                          <p>{item.name}</p>
                        </Col>

                        {/* Quantité */}
                        <Col md={3}>
                          <h3>
                            <Badge bg="success">Quantity</Badge>{' '}
                          </h3>
                          <div className="mt-5">
                            <span>{item.quantity}</span>
                          </div>
                        </Col>

                        {/* Prix */}
                        <Col md={3}>
                          <h3>
                            <Badge bg="success">Price</Badge>{' '}
                          </h3>
                          <div className="mt-5">
                            <span>{item.price}$</span>
                          </div>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Link to="/cart">Edit</Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Order Summury</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col> Items </Col>
                      <Col> ${cart.itemsPrice.toFixed(2)} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Shipping </Col>
                      <Col> ${cart.shippingPrice.toFixed(2)} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col> Tax </Col>
                      <Col> ${cart.taxPrice.toFixed(2)} </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong> Order Total </strong>
                      </Col>
                      <Col>
                        <strong>${cart.totalPrice.toFixed(2)} </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>
                      <Button
                        type="button"
                        onClick={placeOrderHandler}
                        disabled={cart.cartItems.length === 0}
                      >
                        <strong> Place Order </strong>
                      </Button>
                    </div>
                    {loading && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
