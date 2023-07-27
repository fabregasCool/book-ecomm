import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Rating from '../components/Rating';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';

import '../style/Screens.css';
import { toast } from 'react-toastify';

//Reducer
const reducer = (state, actioon) => {
  switch (actioon.type) {
    case `FETCH_REQUEST`:
      return { ...state, loading: true };
    case `FETCH_SUCCESS`:
      return { ...state, product: actioon.payload, loading: false };
    case `FETCH_FAIL`:
      return { ...state, loading: false, error: actioon.payload };
    default:
      return state;
  }
};
function ProductScreen() {
  // Variable pour créer un review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  //Fonction handleSubmit
  const submitHandler = async (e) => {
    //e.preventDefault(); //Il est commenté, donc dès qu'on clique sur ce bouton il réactualise la page, comme ça, on voit e review qui vient d'être créée

    try {
      await axios.post(
        `http://localhost:9000/api/products/${productId}/review`,
        { comment, rating },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      toast.success('Product Review Successfully');

      navigate(`/product/${productId}`);
    } catch (err) {
      //alert('Invalid email or password');
      //  toast.error('Invalid email or password');
      toast.error(getError(err)); //Recupère le mess d'erreur veant du backend
    }
  };

  // useNavigate
  const navigate = useNavigate();

  // Nous allons recuperer le id qui se trouve dans l'url et l'afficher sur la page ProductScreen
  // "id" est dans l'url car dans la route, on a mis:(/:id)

  //La récupéartion se fait par useParams

  //Récupération de l'id de du produit
  const productId = useParams().id;

  // useReduccer
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  // useEffect
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(
          'http://localhost:9000/api/products/read/' + productId
        );
        console.log(result);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [productId]);

  //Accéder aux infos stockés dans le Store
  //ctxDispatch; afin de le distinguer de l'autre dispacch; celui ci est reservé lorsqu'on travail avec react Context
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state; //On recupére l'état actuel du panier

  //Fonction addToCartHandler (Lorsqu'on clique sur "Add To Cart")
  //Ici lorsqu'on clique on fait une incrémentation de 1 par clic
  //product: le même que dans tout le code

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id); //On verifie si l'article existe déja dans le panier
    const quantity = existItem ? existItem.quantity + 1 : 1; //S'il existe déja, c'est la quantité qui est augmenté et non l'artcle dupliqué

    //Recuperer la valeur en stock, afin que l'ajout des articles ne depasse notre stock
    const { data } = await axios.get(
      'http://localhost:9000/api/products/read/' + productId
    ); //
    console.log(data);
    //si la quantité en stock est inf à ce que l'utilsateur veut, addicher le mess d'erreur
    if (data.countInStock < quantity) {
      window.alert('Sorry.Product is out of stock');
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart'); //Qd on clique sur le bouton "Add To Cart" on est dirigé automatiquement vert CartScreen
  };

  //Afin d'éviter que la balise "p" ne s'affiche
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent;
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container>
      <Row className="mt-5">
        {/* 1er Colonne: Image */}

        <Col md={3}>
          <h1>Image</h1>
          <div className="survol">
            <img
              src={`../../upload/${product?.img}`}
              alt={product.name}
              className=""
            />
          </div>
        </Col>

        {/* 2eme Colonne: Toutes Les informations sur le produit */}
        <Col sm={4} md={6}>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <h1>Informations</h1>
          <ListGroup variant="flush">
            {/* variant:flush:Enlever toutes les bordures extérieures */}

            <ListGroup.Item>
              <div>
                ( Moyennes des notes des internautes qui ont evalué ce livre)
              </div>
              <Rating
                rating={product?.rating}
                numReviews={product?.numReviews}
              ></Rating>
            </ListGroup.Item>

            <ListGroup.Item>Price :${product?.price}</ListGroup.Item>

            <ListGroup.Item>
              <p> Description: {getText(product?.description)}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* 3ème Colonne */}
        <Col md={3}>
          <h1>Actions</h1>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col> Price</Col>
                    <Col> ${product?.price}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col> Status</Col>
                    {/* Si la valeur countInStock est > 0 alors on affiche success sinon on affiche danger  */}
                    {/* Cette valeur designe la quantité restante de ce produit en stock */}
                    <Col>
                      {' '}
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {/* On affiche le bouton "Add to cart a la seule condition que le produit existe en stock" */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add To Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Container className="mt-5">
        <Row>
          <Col md={6}>
            <div>REVIEWS</div>
            <div>
              {product.reviews.length === 0 && (
                <MessageBox variant="info">
                  Ce Produit n'a pas encore de review
                </MessageBox>
              )}
            </div>
            {product.reviews.map((review) => (
              <div key={review._id} className="mb-3">
                <strong>{review?.name}</strong>
                <Rating rating={review?.rating}></Rating>
                <span>{review?.createdAt.substring(0, 10)}</span>
                <div>{review?.comment}</div>
              </div>
            ))}
          </Col>

          {/* REVIEW */}
          {userInfo ? (
            <Col md={6}>
              <div>
                <h2>
                  Impossible de donner deux reviews (avis) pour un même produit
                </h2>
                <span> Créer un Review</span>

                <div className="my-4"></div>
                <form action="" onSubmit={submitHandler}>
                  <div className="my-4">
                    <strong>Rating</strong>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      name=""
                      id=""
                      className="col-12 bg-light p-3 mt-2 border-0 rounded"
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="my-4">
                    <strong>Comment</strong>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      name=""
                      id=""
                      cols="30"
                      rows="3"
                      className="col-12 bg-light p-3 mt-2 border-0 rounded"
                    ></textarea>
                  </div>
                  <div className="my-3">
                    <button className="col-12 bg-black border-0 p-3 rounded text-white">
                      SUBMIT
                    </button>
                  </div>
                </form>
              </div>
            </Col>
          ) : (
            <div className="my-3">
              <h6>WRITE A CUSTOMER REVIEW</h6>
              <MessageBox variant="warning">
                Please{' '}
                <Link to="/signin">
                  "<strong>Login</strong>"
                </Link>
                to write a review {''}
              </MessageBox>
            </div>
          )}
        </Row>
      </Container>
    </Container>
  );
}

export default ProductScreen;
