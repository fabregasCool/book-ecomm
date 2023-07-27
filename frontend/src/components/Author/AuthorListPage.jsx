import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';

import { PenFill } from 'react-bootstrap-icons';

import '../../style/style.css';

const AuthorListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['name', 'createdAt', 'updatedAt']; //Tableau contenant les propriétés de la collection author
  //console.log(categorys[0]['name']);

  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [authors, setAuthors] = useState([]);

  // Recuperer tous les size(marques)
  useEffect(() => {
    const fetcchAllAuthors = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/authors/list'); //Recupère tous les marques(size)
        console.log(res);
        setAuthors(res.data); //Mettre à jour les marques(size)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllAuthors();
  }, []);

  //Créer la fonction pour supprimer un livre
  const handleDelete = async (id) => {
    if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
      try {
        await axios.delete('http://localhost:9000/api/authors/delete/' + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title> Liste des auteurs</title>
      </Helmet>
      <p className="admin_title">Liste des auteurs</p>
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
          <PenFill color="#12f" size={40} className="me-3" />
        </InputGroup.Text>
      </InputGroup>
      <p>
        {' '}
        <Button className="" variant="outline-primary">
          <Link className="link" to="/admin/addAuthor">
            Add new Author
          </Link>
        </Button>
      </p>

      <table className="table">
        {/* Entête */}
        <thead>
          <tr>
            <th>Name</th>
            <th>CREATION</th>
            <th>MODIF</th>
            <th rowSpan={2}>ACTIONS</th>
          </tr>
        </thead>

        {/* Corps */}
        <tbody>
          {authors
            .filter((author) =>
              keys.some((key) => author[key].toLowerCase().includes(query))
            )
            .map((author) => (
              <tr key={author._id}>
                <td>{author.name}</td>
                <td>{author.createdAt.substring(0, 10)}</td>
                <td>{author.updatedAt.substring(0, 10)}</td>

                <td>
                  <Button className="me-2" variant="outline-info">
                    <Link
                      className="link"
                      to={`/admin/updateAuthor/${author._id}`}
                    >
                      Update
                    </Link>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleDelete(author._id)}
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

export default AuthorListPage;
