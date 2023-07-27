import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';

import { CartCheckFill } from 'react-bootstrap-icons';

import '../../style/style.css';

const OrderListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['_id', 'paymentMethod', 'createdAt', 'paidAt']; //Tableau contenant les propriétés de la collection category
  //console.log(categorys[0]['name']);
  //UseNavigate
  const navigate = useNavigate();

  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [orders, setOrders] = useState([]);

  // Recuperer toutes les orders
  useEffect(() => {
    const fetcchAllOrders = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/orders/list'); //Recupère tous les marques(brand)
        console.log(res);
        setOrders(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllOrders();
  }, []);

  //Créer la fonction pour supprimer une commande
  // const handleDelete = async (id) => {
  //   if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
  //     try {
  //       await axios.delete('http://localhost:9000/api/orders/delete/' + id);
  //       window.location.reload();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  return (
    <div className="container">
      <Helmet>
        <title> Liste de toutes les commandes</title>
      </Helmet>
      <p className="admin_title">Liste de toutes les commandes</p>

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

      <table className="table">
        {/* Entête */}
        <thead>
          <tr>
            <th>ID Commande</th>
            <th>Client</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th>PAYMENT METHOD</th>
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
                <td>{order?.user?.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>{order?.paymentMethod}</td>

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
    </div>
  );
};

export default OrderListPage;
