import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getError } from '../utils';
// import { toast } from 'react-toastify';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import { toast } from 'react-toastify';

//reducer pour OrderScreen
function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      // Action de recupérer les informations relatif à une commande
      return { ...state, loading: true, error: '' };
    // Le cas où la requête est un succes (on recupère les infos venant du backend(order: action.payload))
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    // Le cas où la requête est un échec (puis on renvoie le mess d'erreur : (error: action.payload))
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    //Partie Paypal
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: true, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
}

export default function OrderScreen() {
  //Déclaration de la variable useReducer mais pour le script Paypal
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  //Fonction createOrder qui se trouve dans le bouton paypal
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }
  //Fonction onApprove qui se trouve dans le bouton paypal
  // Cette fonction s'exécute si le paiement est réussi
  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `http://localhost:9000/api/orders/${order._id}/pay`,
          details,
          // details: contient les infos de l'user et les infos de paiement sur le site paypal
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  //Fonction onError qui se trouve dans le bouton paypal
  function onError(err) {
    toast.error(getError(err));
  }

  //UseNavigate
  const navigate = useNavigate();

  //useParams (Recupérer l'id de l'order(commande) dans l'url)
  //   cet id recupérer sera renommé en orderId
  const params = useParams();
  const { id: orderId } = params;

  //Afin d'avoir accès aux infos stockés dans le local storage
  const { state } = useContext(Store);
  const { userInfo } = state;

  //
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      order: {},
      successPay: false,
      loadingPay: false,
    });

  //UseEffect
  useEffect(() => {
    //Fonction fetchOrder
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(
          `http://localhost:9000/api/orders/read/${orderId}`,

          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        console.log(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        // toast.error(getError(err));
      }
    };

    // Si l'utilisateur n'est pas authentifié, il est directement rerigé vers le la page de connexion
    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      // Fonction pour obtenir le clientId: PAYPAL_CLIENT_ID
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          `http://localhost:9000/api/keys/paypal`,

          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        console.log(clientId);
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3"> Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>Address: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country},
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {order.paymentMethod},
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={`../../upload/${item?.img}`}
                          alt={item.name}
                          className="img_thumbnail me-5"
                        />
                        <span>{item.name}</span>
                      </Col>
                      <Col md={2}>
                        <span>{item.quantity}</span>
                        {/* <span>{item.product.book}</span> */}
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={4}>
                        {order.isPaid ? (
                          <h3>
                            <Badge bg="success">
                              {' '}
                              <a
                                href={`../../upload/${item.product.book}`}
                                className="link2"
                              >
                                Télécharger le Livre: {item.name}
                              </a>
                            </Badge>
                          </h3>
                        ) : (
                          <div variant="danger"></div>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summury</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col> Items </Col>
                    <Col> ${order.itemsPrice.toFixed(2)} </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col> Shipping </Col>
                    <Col> ${order.shippingPrice.toFixed(2)} </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col> Tax </Col>
                    <Col> ${order.taxPrice.toFixed(2)} </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total </strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)} </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* Affiche boutons paypal */}
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}

                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* {order.isPaid ? (
        <span>
          {' '}
          <a href={`../../upload/${order.product?.book}`} className="">
            Telecharger
          </a>
        </span>
      ) : (
        <MessageBox variant="danger">Not Paid</MessageBox>
      )} */}
    </div>
  );
}
