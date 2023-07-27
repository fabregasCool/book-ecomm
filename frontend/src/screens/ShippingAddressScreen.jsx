import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';

import '../style/Screens.css';

//Cette page ne s'affiche que si l'uilisateur est conneté avec ses identifiants

export default function ShippingAddressScreen() {
  const navigate = useNavigate();

  // Notre useContext (Avoir accè_s aux infos du local storage)
  const { state, dispatch: ctxDispatch } = useContext(Store);

  //   Lorsqu'on actualise ShippingAddessScreen, les infos du form disparaissent, alors ce code règle cela avec les initialisations qui sont dans useState
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  //Declaration des variables
  //Grace a cette initialisation des variables, on verifie d'abord si l'info existe dans local storage(shippingAddress.fullName) sinon on affiche un champ vide ('')
  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  //UseEffect (Lorsqu'on se deconnecte les infos dans le form st présents, ce n'est pas bon, c'est ce code qui corrige cette anomalie; aussi le "userInfo de la ligne 19")
  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping'); //Tant que l'utilsateur n'est pas connecté, il ne pourra jamais accéder au shippingAddress
    }
  }, [userInfo, navigate]);

  //Fonction submitHandler (C'est cette Partie qui envoie le formualire avec l'action 'SAVE_SHIPPING_ADDRESS')
  const submitHandler = async (e) => {
    // e.preventdefault();
    ctxDispatch({
      // Cette action est gérer dans Store
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    // On enregistre les infos ecrit ds le form ds le local storage; com ça mm si l'user actualise la page ou va sur un autre page,
    // Ces informations seront tjrs disponibles tant qu'il reste connecté.

    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment'); //Si tout est bon on est dirigé vers la page de paiement
  };
  return (
    <div>
      {' '}
      <Helmet>
        <title> Shipping Address</title>
      </Helmet>
      <Container>
        <CheckoutSteps step1 step2>
          {' '}
        </CheckoutSteps>
        <Row>
          <Col md={3}></Col>

          {/* Formualaire */}
          <Col md={6} className="mt-3">
            <h1 className="my-3"> Shipping Address</h1>
            <Form onSubmit={submitHandler}>
              {/* Nom Complet de l'utilisateur */}
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name </Form.Label>
                <Form.Control
                  value={fullName}
                  required
                  onChange={(e) => setFullName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {/* Addresse  */}
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Address </Form.Label>
                <Form.Control
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {/* City */}
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>City </Form.Label>
                <Form.Control
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {/* Code Postal */}
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Postal Code </Form.Label>
                <Form.Control
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              {/* Country */}
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Country </Form.Label>
                <Form.Control
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <div className="mb-3">
                <Button variant="primary" type="submit">
                  Continue
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  );
}
