import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';

import { PersonCircle } from 'react-bootstrap-icons';

import '../../style/style.css';

const UsersListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['name', 'email', 'createdAt']; //Tableau contenant les propriétés de la collection users
  //console.log(categorys[0]['name']);
  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [users, setUsers] = useState([]);

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

  //Créer la fonction pour supprimer un livre
  const handleDelete = async (id) => {
    if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
      try {
        await axios.delete('http://localhost:9000/api/users/delete/' + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title> Liste des Utilisateurs</title>
      </Helmet>
      <p className="admin_title">Liste des Utilisateurs</p>

      <p>
        {' '}
        <Button className="" variant="outline-primary">
          <Link className="link" to="/admin/addUser">
            Add new User
          </Link>
        </Button>
      </p>

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
          <PersonCircle color="#00FF11" size={40} className="me-3" />
        </InputGroup.Text>
      </InputGroup>
      <table className="table">
        {/* Entête */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>isAdmin</th>
            <th>Création</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        {/* Corps */}
        <tbody>
          {users
            .filter((user) =>
              keys.some((key) => user[key].toLowerCase().includes(query))
            )
            .map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{String(user.isAdmin)}</td>
                <td>{user?.createdAt.substring(0, 16).split('T') + ' '}</td>

                <td>
                  <Button className="me-2" variant="outline-info">
                    <Link className="link" to={`/admin/updateUser/${user._id}`}>
                      Update
                    </Link>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListPage;
