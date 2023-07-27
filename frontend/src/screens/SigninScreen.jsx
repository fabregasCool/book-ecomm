import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

export default function SigninScreen() {
  const navigate = useNavigate();

  // Code pour l'obliger a rester sur sur la page d'accueil si un utilisateur est déja connecté
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //Declaration des variables
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  // Avoir accès au données stockés dans le local storage
  const { state, dispatch: ctxDispatch } = useContext(Store);

  //Recuperer notre utilisateur actuel qui se trouve dans le state(local storage)
  const { userInfo } = state;

  //Fonction handleChange
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Fonction handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'http://localhost:9000/api/auth/signin',
        inputs
      );
      console.log(data);
      ctxDispatch({ type: 'USER_SIGNIN', payload: data }); //Appelle de l'action USER_SIGNIN
      localStorage.setItem('userInfo', JSON.stringify(data)); //On enregistre les infos de l'user dans le local storage en les convertissants en string car dans le local storage, les données st tjrs en string
      navigate(redirect || '/');
    } catch (err) {
      //alert('Invalid email or password'); //Mess d'erreur normal
      //toast.error('Invalid email or password'); //Affiche un toast avec ce message-ci
      toast.error(getError(err)); //Affiche un toast mais avec le mess d'erreur venant du backend(notre api)
    }
  };

  //Grace à ce code, il sera tjrs redirigé vers la page d'accueil si le client est deja connecté
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="">
      <Helmet>
        <title> Connectez-Vous</title>
      </Helmet>
      <Row>
        <Col md={3}></Col>
        <Col md={6} className="mt-5">
          <h1 className="my-3">Connectez-Vous</h1>
          <Form className="">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="email"
                name="email"
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password </Form.Label>
              <Form.Control
                required
                type="password"
                name="password"
                autocomplete="on"
                onChange={handleChange}
              />
            </Form.Group>

            <div className="mb-3">
              <Button variant="primary" onClick={handleSubmit}>
                Login
              </Button>
            </div>
            <div className="mb-3">
              New Custommer?{' '}
              <Link to={`/signup?redirect=${redirect}`}>
                Create your account
              </Link>
              {/* L'utilisateur est dirigé vers singnup(page d'inscription) */}
            </div>
            <div className="mb-3">
              <Link to={`/forgotPassword?redirect=${redirect}`}>
                Forgot your password ?
              </Link>
              {/* L'utilisateur est dirigé vers singnup(page d'inscription) */}
            </div>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
}
