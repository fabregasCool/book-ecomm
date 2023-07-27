import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

//reducer pour ProfileScreen
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
}
export default function ProfileScreen() {
  //Afin d'avoir accès aux infos stockés dans le local storage
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  //Declaration des variables du formulaire
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setCompfirmPassword] = useState('');

  //   Definissons un useReducer
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault(); //Eviter qu'il rafrachisse la page lorsqu'on clique sur le bouton "Update"

    // Comparaison des deux mots de passe
    if (password !== confirmPassword) {
      toast.error('Les deux mots de passe sont différents'); //Affiche Ce message
      return; //Si les mots sont diiférents; tout ce qui se trouve en dessous ne sera pas exécuté
    }

    try {
      const { data } = await axios.put(
        'http://localhost:9000/api/users/updateProfile',
        {
          name,
          email,
          password,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });

      ctxDispatch({
        type: 'USER_SIGNIN',
        payload: data,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated Successfully');
    } catch (err) {
      dispatch({
        // type: 'FETCH_FAIL',
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return (
    <div className="container small-container">
      {' '}
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3"> User Profile</h1>
      <Form onSubmit={submitHandler}>
        {/* User name */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name </Form.Label>
          <Form.Control
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* User Email */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email </Form.Label>
          <Form.Control
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* User Password */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password </Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {/* User Confirm Password */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Confirm Password </Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setCompfirmPassword(e.target.value)}
          />
        </Form.Group>

        {/* Bouton d'envoi */}
        <div className="mb-3">
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
}
