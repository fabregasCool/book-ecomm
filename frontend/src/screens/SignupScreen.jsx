import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const SignupScreen = () => {
  //Utilisation de useNavigate
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  //Declaration des variables
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;

  //Fonction handleChange
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //Fonction handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comparaison des deux mots de passe
    if (inputs.password !== inputs.confirm_password) {
      toast.error('Les deux mots de passe sont différents'); //Affiche Ce message
      return; //Si les mots sont diiférents; tout ce qui se trouve en dessous ne sera pas exécuté
    }

    try {
      const { data } = await axios.post(
        'http://localhost:9000/api/auth/register',
        inputs
      );
      // Qd on finit de créer l'utilisateur, on se connecte automatique d'où (type: 'USER_SIGNIN')
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
    } catch (err) {
      //alert('Invalid email or password');
      //  toast.error('Invalid email or password');
      toast.error(getError(err)); //Recupère le mess d'erreur veant du backend
    }
  };

  //Grace à ce code, il sera ttrs redirigé vers la page d'accueil si le client est deja connecté
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="">
      <Helmet>
        <title> Créer un Nouvel Utilisateur</title>
      </Helmet>
      <Row>
        <Col md={3}></Col>
        <Col md={6} className="mt-3">
          <h1 className="my-3">Créer un Nouvel Utilisateur</h1>
          <Form className="">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Username </Form.Label>
              <Form.Control
                className="FormControl"
                required
                type="text"
                placeholder="name"
                name="name"
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email </Form.Label>
              <Form.Control
                required
                type="email"
                name="email"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password </Form.Label>
              <Form.Control
                required
                autoComplete="new-password"
                type="password"
                name="password"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirm_password">
              <Form.Label>Confirm Password </Form.Label>
              <Form.Control
                required
                autoComplete="new-password"
                type="password"
                name="confirm_password"
                autocomplete="on"
                onChange={handleChange}
              />
            </Form.Group>

            <div className="mb-3">
              <Button variant="primary" onClick={handleSubmit}>
                SignupScreen
              </Button>
            </div>
            <div className="mb-3">
              Already have a account?{' '}
              <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
            </div>
          </Form>
        </Col>
        <Col md={3}></Col>
      </Row>
    </Container>
  );
};

export default SignupScreen;
