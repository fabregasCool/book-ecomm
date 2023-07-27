import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PersonCircle } from 'react-bootstrap-icons';

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  //Variable pour recupérer le message d'erreur qui s'affiche dans la console
  //disant que l'utilisateur existe déjà:"User already exists"
  const [err, setError] = useState(null);

  //Après avoir créer notre variable, on peut mainteneant l'utiliser

  const [name, setName] = useState('');

  //Création de la fonction handleClick
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:9000/api/categorys/create`, {
        name,
      });
      navigate('/admin/categoryList'); //Si l'article est crée sans problème, on sera dirigé vers la page d'accueil
    } catch (err) {
      console.log(err);
      setError(err?.response.data.message); //Afiiche l'erreur de la console
    }
  };

  return (
    <div className=" mt-5">
      <h1 className="mb-3 text-center">Créer une Categorie</h1>
      <Helmet>
        <title> Créer une Categorie</title>
      </Helmet>

      <Container>
        <Row>
          <Col md={3}></Col>
          <Col md={6} className=" ">
            {err && (
              <Button variant="danger" className="my-3">
                {err}
              </Button>
            )}
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                {' '}
                <PersonCircle color="#000" size={30} className="me-3" />
              </InputGroup.Text>

              <Form.Control
                className="border-5"
                type="text"
                value={name}
                placeholder="Nom de categorie"
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </InputGroup>

            <Button variant="success" className="ms-2" onClick={handleClick}>
              Créer
            </Button>
          </Col>
          <Col md={3}> </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryCreatePage;
