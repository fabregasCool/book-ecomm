import React, { useEffect, useReducer } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
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

export default function ProductByCategory() {
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

  // Partie pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = products.slice(firstIndex, lastIndex);
  const npage = Math.ceil(products.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  function prevPage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCurrentPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  // Fin Pagination

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
                {records?.map((product) => (
                  // {filteredProducts?.map((product) => (
                  <Col key={product._id} className="mb-3">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </div>
      </div>
      {/* <Pagination /> */}
      {/* Pagination */}
      <div className="navig_pagin mt-5">
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <a href="#" className="page-link fs-4" onClick={prevPage}>
                Prev
              </a>
            </li>
            {numbers.map((n, i) => {
              <li
                className={`page-item ${currentPage === n ? 'active' : ''}`}
                key={i}
              >
                {n}
                <a
                  href="#"
                  className="page-link"
                  onClick={(n) => changeCurrentPage}
                >
                  {n}1
                </a>
              </li>;
            })}

            <li className="page-item">
              <a href="#" className="page-link fs-4" onClick={nextPage}>
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
