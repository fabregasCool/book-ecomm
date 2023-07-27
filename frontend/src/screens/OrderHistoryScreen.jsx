import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

import { CartCheckFill } from 'react-bootstrap-icons';

//reducer pour OrderHistory
function reducer(state, action) {
  switch (action.type) {
    // Action de recupérer les informations relatif à une commande
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    // Le cas où la requête est un succes (on recupère les infos venant du backend(order: action.payload))
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    // Le cas où la requête est un échec (puis on renvoie le mess d'erreur : (error: action.payload))
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderHistoryScreen() {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['_id', 'createdAt', 'createdAt']; //Tableau contenant les propriétés de la collection category
  //console.log(categorys[0]['name']);
  //UseNavigate
  const navigate = useNavigate();

  //Afin d'avoir accès aux infos stockés dans le local storage
  const { state } = useContext(Store);
  const { userInfo } = state;

  //useReducer
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    // orders: {},
  });

  //Fonction  (Recupère toutes  les commandes de l'utilisateur connecté)
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `http://localhost:9000/api/orders/allOrdersOfTheUser`,

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
    fetchData();
  }, [userInfo]);

  return (
    <div className="container">
      {' '}
      <Helmet>
        <title> Order History</title>
      </Helmet>{' '}
      <h1 className="my-3"> Order History</h1>
      {/* Zone de Recherche */}
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          className="fs-3 border-3 fw-bolder "
          placeholder="Rechercher..."
          onChange={(e) => setQuery(e.target.value)}
        ></Form.Control>
        <InputGroup.Text id="basic-addon1">
          {' '}
          <CartCheckFill color="#FFA500" size={50} className="me-3" />
        </InputGroup.Text>
      </InputGroup>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger"></MessageBox>
      ) : (
        <table className="table">
          {/* Entête */}
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          {/* Corps */}
          <tbody>
            {orders
              .filter((order) =>
                keys.some((key) => order[key].toLowerCase().includes(query))
              )
              .map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>

                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>

                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : 'No'}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
