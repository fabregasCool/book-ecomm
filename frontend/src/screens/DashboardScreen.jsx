import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { CartCheckFill, PersonBoundingBox } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../style/Screens.css';
import BarChart from '../components/Charts/BarChart';

import DynamicChart from '../components/Charts/DynamicChart';

// import LineChart from '../components/Charts/LineCharts';
// import PieChart from '../components/Charts/PieChart';

export default function DashboardScreen() {
  //Déclaration de la variable
  const [users, setUsers] = useState([]); //Variable pour les utilisateurs
  const [orders, setOrders] = useState([]); //Variable pour afficher la liste des commandes
  const [sumorders, setSumOrders] = useState(); //Variable pour afficher la somme des commandes

  const [sumorderssolde, setSumOrdersSolde] = useState(); //Variable pour afficher la somme des commandes soldés
  const [nbreorderssoldes, setNbreOrdersSoldes] = useState(); //Variable pour afficher le nombre de commandes soldés

  // Recuperer toutes les users
  useEffect(() => {
    const fetcchAllUsers = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/users/list'); //Recupère tous les marques(brand)
        console.log(res);
        setUsers(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };

    fetcchAllUsers();
  }, []);

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

  // Recuperer la somme totale  des Commandes
  useEffect(() => {
    const fetcchAllOrders = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/orders/sumPriceOrders'
        ); //Recupère tous les marques(brand)
        console.log(res);
        setSumOrders(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllOrders();
  }, []);

  // Recuperer la somme totale  des Commandes qui ont été soldés par les clients
  useEffect(() => {
    const fetcchAllOrdersSoldes = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/orders/totalVentesOrders'
        ); //Recupère tous les marques(brand)
        console.log(res);
        setSumOrdersSolde(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllOrdersSoldes();
  }, []);

  // Recuperer la somme totale  des Commandes
  useEffect(() => {
    const fetcchNumbOrdersSoldes = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/orders/nbreorderssoldes'
        ); //Recupère tous les marques(brand)
        console.log(res);
        setNbreOrdersSoldes(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchNumbOrdersSoldes();
  }, []);
  return (
    <div>
      <Helmet>
        <title> Dashboard</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          {/* Nombre d'utilisateurs */}
          <Col md={4}>
            <Card>
              <Card.Header className="fs-5">
                <PersonBoundingBox color="#000" size={30} className="me-5 " />
                Users (Utilisateurs)
              </Card.Header>
              <Card.Body>
                <p className="nb_users">{users.length}</p>
                <Card.Text></Card.Text>
              </Card.Body>
              <Card.Footer className="fs-5">
                <Link className="dropdown-item" to="/admin/userlist">
                  <div className="d-grid">
                    {' '}
                    <Button className="" variant="primary">
                      Voir la liste
                    </Button>{' '}
                  </div>
                </Link>
              </Card.Footer>
            </Card>
          </Col>

          {/* Nombre de Commandes */}
          <Col md={4}>
            <Card>
              <Card.Header className="fs-5">
                <CartCheckFill color="#000" size={30} className="me-5 " />
                Orders (Commandes)
              </Card.Header>
              <Card.Body>
                <p className="nb_users">{orders.length} </p>
                <Card.Text></Card.Text>
              </Card.Body>
              <Card.Footer className="fs-5">
                <p className=""> Total {sumorders}$</p>
                <Link className="dropdown-item" to="/admin/orderList">
                  <div className="d-grid">
                    {' '}
                    <Button className="" variant="primary">
                      Voir la liste
                    </Button>{' '}
                  </div>
                </Link>
              </Card.Footer>
            </Card>
          </Col>

          {/* Nombre de Commandes */}
          <Col md={4}>
            <Card>
              <Card.Header className="fs-5">
                <CartCheckFill color="#000" size={30} className="me-5 " />
                Sales (Ventes)
              </Card.Header>
              <Card.Body>
                <p className="nb_users">{nbreorderssoldes} </p>
                <Card.Text></Card.Text>
              </Card.Body>
              <Card.Footer className="fs-5">
                <p className=""> Total {sumorderssolde}$</p>
                <Link className="dropdown-item" to="/admin/orderList">
                  <div className="d-grid">
                    {' '}
                    <Button className="" variant="primary">
                      Voir la liste
                    </Button>{' '}
                  </div>
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Chart (Graphique) */}

      <div className="mx-5">
        <div className="card">
          <DynamicChart />
        </div>
      </div>
    </div>
  );
}
