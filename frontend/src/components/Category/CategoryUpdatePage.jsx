import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useNavigate, useParams } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';

const CategoryUpdatePage = () => {
  const navigate = useNavigate();

  //Variable pour recupérer le message d'erreur qui s'affiche dans la console
  //disant que l'utilisateur existe déjà:"Brand already exists"
  const [err, setError] = useState(null);

  //Récupération de l'id de l'utilisateur qui se trouve dans l'url
  const categoryId = useParams().id;

  //Déclaration des variables

  const [name, setName] = useState('');

  //Si l'utilistateur existe déja, on recupère ses informations grace à la fonction (getCategory)
  useEffect(() => {
    if (categoryId) {
      // recuperation d'un utilisateur
      getCategory(categoryId);
    }
  }, [categoryId]);

  //Création de la fonction getCategory (Elle recupère les informations de la BDD vers le front-end)
  //c'est grace a ce code que le nom et le prenom s'affiche automatiquement quand on clique sur modifier
  const getCategory = async (categoryId) => {
    const response = await axios.get(
      'http://localhost:9000/api/categorys/read/' + categoryId
    );
    setName(response.data.name);
  };

  //Création de la fonction handleClick
  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        'http://localhost:9000/api/categorys/update/' + categoryId,
        {
          name,
        },
        { withCredentials: true }
      );
      navigate('/admin/categoryList'); //Si l'article est crée sans problème, on sera dirigé vers la page d'accueil
    } catch (err) {
      console.log(err);
      setError(err?.response.data.message); //Afiiche l'erreur de la console
    }
  };

  return (
    <div className="container mt-5">
      <Helmet>
        <title> Modifier la Marque</title>
      </Helmet>
      <h1 className="mb-3 text-center">Modifier la Marque</h1>
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
                placeholder="Brand(Marque)"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>

            <Button variant="success" className="ms-2" onClick={handleClick}>
              Update
            </Button>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  );
};

export default CategoryUpdatePage;
