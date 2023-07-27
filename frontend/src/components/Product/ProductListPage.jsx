import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';

import { Helmet } from 'react-helmet-async';

import '../../style/style.css';
import { BookHalf } from 'react-bootstrap-icons';

const ProductListPage = () => {
  // Variable pour la recherche
  const [query, setQuery] = useState('');
  const keys = ['name', 'createdAt']; //Tableau contenant les propriétés de la collection category
  //console.log(categorys[0]['name']);

  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetcchAllProducts = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/products/listforAdmin'
        ); //Recupère tous les marques(brand)
        console.log(res.data);
        setProducts(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllProducts();
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title> Liste des Produits</title>
      </Helmet>
      <p className="admin_title">Liste des Produits</p>

      <p>
        <Link className="link" to="/admin/write">
          {' '}
          <Button>Add new product</Button>
        </Link>
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
          <BookHalf color="#FF0000" size={50} className="me-3" />
        </InputGroup.Text>
      </InputGroup>
      <table className="table">
        {/* Entête */}
        <thead>
          <tr>
            <th>Creation</th>
            <th>Image</th>
            <th>Name</th>
            <th>Author</th>
            <th>Size</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qté en Stock</th>
            <th>Livre</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        {/* Corps */}
        <tbody>
          {products
            ?.filter((cat) =>
              keys.some((key) => cat[key].toLowerCase().includes(query))
            )
            .map((product) => (
              <tr key={product?._id}>
                <td>{product?.createdAt.substring(0, 16).split('T') + ' '}</td>
                <td>
                  {' '}
                  <img
                    src={`../../upload/${product?.img}`}
                    alt={product?.name}
                    className="img_thumbnail"
                  />
                </td>
                <td>{product?.name}</td>
                <td>{product?.author?.name}</td>
                <td>{product?.size?.name}</td>
                <td>{product?.category?.name}</td>
                <td>{product?.price} $</td>
                <td>{product?.countInStock}</td>
                {product?.book ? (
                  <td>
                    {' '}
                    <a href={`../../upload/${product?.book}`}>
                      Télécharger le Livre: {product?.name}
                    </a>
                  </td>
                ) : (
                  <h3>
                    <Badge bg="danger"> Pas de livre </Badge>
                  </h3>
                )}

                <td>
                  <Link
                    className="link_post"
                    to={`/admin/product/${product?._id}`}
                  >
                    <Button variant="outline-secondary" className="ms-2">
                      Deétails
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListPage;
