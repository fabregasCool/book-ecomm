import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';

import { Folder, FolderFill } from 'react-bootstrap-icons';

import '../../style/style.css';

const SizeListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['name', 'createdAt', 'updatedAt']; //Tableau contenant les propriétés de la collection size
  //console.log(categorys[0]['name']);

  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [sizes, setSize] = useState([]);

  // Recuperer tous les size(marques)
  useEffect(() => {
    const fetcchAllSizes = async () => {
      try {
        const res = await axios.get('http://localhost:9000/api/sizes/list'); //Recupère tous les marques(size)
        console.log(res);
        setSize(res.data); //Mettre à jour les marques(size)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllSizes();
  }, []);

  //Créer la fonction pour supprimer un livre
  const handleDelete = async (id) => {
    if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
      try {
        await axios.delete('http://localhost:9000/api/sizes/delete/' + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title> Liste des Tailles</title>
      </Helmet>
      <p className="admin_title">Liste des Tailles</p>

      <p>
        {' '}
        <Button className="" variant="outline-primary">
          <Link className="link" to="/admin/addSize">
            Add new Size
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
          <FolderFill color="#000" size={40} className="me-3" />
        </InputGroup.Text>
      </InputGroup>
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
          {sizes
            .filter((size) =>
              keys.some((key) => size[key].toLowerCase().includes(query))
            )
            .map((size) => (
              <tr key={size._id}>
                <td>{size.name}</td>
                <td>{size.createdAt.substring(0, 10)}</td>
                <td>{size.updatedAt.substring(0, 10)}</td>

                <td>
                  <Button className="me-2" variant="outline-info">
                    <Link className="link" to={`/admin/updateSize/${size._id}`}>
                      Update
                    </Link>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleDelete(size._id)}
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

export default SizeListPage;
