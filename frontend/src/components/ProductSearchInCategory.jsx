import React, { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import '../style/Screens.css';
import Product from '../components/Product';
import Pagination from '../components/Pagination';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';

//Création de la fonction reducer
const reducer = (state, action) => {
  switch (action.type) {
    case `FETCH_REQUEST`: //Cette action est déclenchée lorsqu'on envoie une requête au backend; on met loading à true(on pourra l'afficher si on veut)
      return { ...state, loading: true };
    case `FETCH_SUCCESS`: //Cette action est déclenchée si la requête est réussie; action.payload contient tous les produits venant du backend
      return { ...state, products: action.payload, loading: false };
    case `FETCH_FAIL`: //Cette action est déclenchée si la requête a echoué; action.payload contient le message d'erreur
      return { ...state, loading: false, error: action.payload };
    default: //Si action.type n'est pas égal à ces trois cas, il renvoie l'état actuel(state)
      return state;
  }
};

export default function ProductSearchInCategory() {
  const [author, setAuthor] = useState([]);
  const [authors, setAuthors] = useState([]); //Tableau contenant toutes les tailles

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
  //Récupération de l'id de l'utilisateur qui se trouve dans l'url

  const location = useLocation();
  //Recupère l'Id de la category qui est contenu dans l'url

  const categoryId = location.pathname.split('/')[2];
  console.log(categoryId);

  //Declaration de notre variable qui contient les posts(articles) à travers useReducer
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });

  //Fonction useEffect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          `http://localhost:9000/api/products/getProductsByCategory/${categoryId}`
        );
        console.log(result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
        //le message d'erreur venat du backend est "Network error"
      }
    };
    fetchData();
  }, []);

  // Partie pour les flitres
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');

  const handleFilters = (e) => {
    const value = e.target.value;
    console.log(value);
    setFilters({
      ...filters,
      [e.target.name]: value,
    });
  };
  //console.log(filters);

  const [filteredProducts, setFilterdProducts] = useState([]);
  //Fonction useEffect (Afin de filtrer apr l'auteur  et par la taille)
  useEffect(() => {
    setFilterdProducts(
      products.filter((item) =>
        Object.entries(filters).every(([key, value]) =>
          item[key].includes(value)
        )
      )
    );
  }, [products, categoryId, filters]);

  //Fonction useEffect (Afin de filtrer par les prix)
  useEffect(() => {
    if (sort === 'newest') {
      setFilterdProducts((prev) => [
        ...prev.sort((a, b) => a.createdAt - b.createdAt),
      ]);
    } else if (sort === 'asc') {
      setFilterdProducts((prev) => [...prev.sort((a, b) => a.price - b.price)]);
    } else {
      setFilterdProducts((prev) => [...prev.sort((a, b) => b.price - a.price)]);
    }
  }, [sort]);

  // Fin Filtre
  return (
    <div className="app">
      {' '}
      <Helmet>
        <title>Barriza</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        <div className="products">
          {/* On affiche d'abord le mess de chargement pd(FETCH_REQUEST) et le mess d'erreur pdt(FETCH_FAIL) */}
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Container>
              <Row>
                <div className="mb-5">
                  <span className="me-2">Filter Product By Name</span>
                  <select
                    name="name"
                    id=""
                    className="me-5"
                    onChange={handleFilters}
                  >
                    <option value="" disabled>
                      Color
                    </option>
                    <option value="hanifa">hanifa</option>
                    <option value="ahmad">ahmad</option>
                    <option value="malik">malik</option>
                  </select>

                  <span className="me-2">Filter Product By Color</span>
                  <select
                    name=""
                    id=""
                    className="me-5"
                    onChange={handleFilters}
                  >
                    <option value="" disabled>
                      Size
                    </option>
                    <option value="great">great</option>
                    <option value="medium">medium</option>
                    <option value="small">small</option>
                  </select>

                  <span className="ms-5">Sort Product</span>
                  <select
                    name=""
                    id=""
                    className="ms-2"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="asc">Price (asc)</option>
                    <option value="desc">Price(desc)</option>
                  </select>
                </div>
              </Row>

              <Row>
                {filteredProducts?.map((product) => (
                  // {filteredProducts?.map((product) => (
                  <Col key={product._id} className="mb-3">
                    <Product
                      product={product}
                      cat={categoryId}
                      filters={filters}
                      sort={sort}
                    />
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </div>
      </div>
      {/* <Pagination /> */}
      {/* Pagination */}
    </div>
  );
}
