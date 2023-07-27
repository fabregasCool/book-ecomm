import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';

import { Fire } from 'react-bootstrap-icons';

import '../../style/style.css';

const CategoryListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['name', 'createdAt', 'updatedAt']; //Tableau contenant les propriétés de la collection category
  //console.log(categorys[0]['name']);

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

  //Créer la fonction pour supprimer un livre
  const handleDelete = async (id) => {
    if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
      try {
        await axios.delete('http://localhost:9000/api/categorys/delete/' + id);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title> Liste des Categories</title>
      </Helmet>
      <p className="admin_title">Liste des Categories</p>

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
          <Fire color="#FF0000" size={50} className="me-3" />
        </InputGroup.Text>
      </InputGroup>

      {/*  */}
      <p>
        {' '}
        <Button className="" variant="outline-primary">
          <Link className="link" to="/admin/addCategory">
            Add new Category
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
          {categorys
            .filter((cat) =>
              keys.some((key) => cat[key].toLowerCase().includes(query))
            )
            .map((cat) => (
              <tr key={cat._id}>
                <td>{cat?.name}</td>
                <td>{cat?.createdAt.substring(0, 10)}</td>
                <td>{cat?.updatedAt.substring(0, 10)}</td>

                <td>
                  <Button className="me-2" variant="outline-info">
                    <Link
                      className="link"
                      to={`/admin/updateCategory/${cat._id}`}
                    >
                      Update
                    </Link>
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="ms-2"
                    onClick={() => handleDelete(cat._id)}
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

export default CategoryListPage;
