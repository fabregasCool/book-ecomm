import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';

// import '../../style/style.css';

const HomeScreen = () => {
  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [categorys, setCategorys] = useState([]);

  // Recuperer toutes les category
  useEffect(() => {
    const fetcchAllCategorys = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/categorys/list'); //Recupère tous les marques(brand)
        console.log(res);
        setCategorys(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllCategorys();
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title> HomeScreen</title>
      </Helmet>
      <p className="admin_title">
        Liste des Categories sur la pade d'accueil (HomeScreen)
      </p>

      <Row className="mt-5">
        <h1>
          <Badge bg="danger">
            {' '}
            RECHERCHER UN ARTCICLE DANS SA CATEGORIE EN FONCTION DE...
          </Badge>
        </h1>
        {categorys?.map((cat) => (
          <Col key={cat._id} className="mb-3 ac-form ">
            <Card className="border mt-5">
              <Link
                className="link_search_in_category"
                to={`/searchProductinCategory/${cat._id}`}
              >
                {' '}
                {cat.name}
              </Link>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <h1>
          <Badge bg="success"> TOUS LES ARTICLES PAR CATEGORIE</Badge>
        </h1>
        {categorys?.map((cat) => (
          <Col key={cat._id} className="mb-3 ac-form ">
            <Card className="border mt-5">
              <Link
                className="link_category"
                to={`/productsByCategory/${cat._id}`}
              >
                {' '}
                {cat.name}
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeScreen;
