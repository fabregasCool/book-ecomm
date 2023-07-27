import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';

import { Helmet } from 'react-helmet-async';

export default function ProductSinglePage() {
  // UseNavigate
  const navigate = useNavigate();

  //Declaration de notre variable
  //post est la variable dans laquelle se trouve les informations d'un article ou produit(post)
  const [post, setPost] = useState({});
  const [qtyCommande, setQtyCommande] = useState();
  const [qtyCommandeEtPaye, setQtyCommandeEtPaye] = useState();

  //Atteindre l'url
  const location = useLocation();
  //Recupère l'Id du post qui est contenu dans l'url
  //C'est grâce à cet Id qu'on pourra attendre notre utilisateur, ainsi afficher son nom
  const postId = location.pathname.split('/')[3];
  console.log(postId);

  //Recupération des informations d'un seul produit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          // `http://localhost:9400/api/products/read/${postId}`
          'http://localhost:9000/api/products/read/' + postId
        );
        setPost(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  //Creation de la fonction handleDelete (Supprimer un post)
  const handleDelete = async () => {
    if (window.confirm('Etes vous sûr(e) de vouloir supprimer ?')) {
      try {
        await axios.delete(
          // `http://localhost:9400/api/products/${postId}`
          'http://localhost:9000/api/products/delete/' + postId,
          {
            withCredentials: true,
          }
        );
        navigate('/admin/productList'); //Si la suppression est réussie, nous sommes dirigé sur la page des produits
      } catch (err) {
        console.log(err);
      }
    }
  };

  //Afin d'éviter que la balise "p" ne s'affiche
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent;
  };

  //Recupération des informations sur la quantité commandé mais pas payé
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          // `http://localhost:9400/api/products/read/${postId}`
          'http://localhost:9000/api/products/qteCommmandePourUnProduct/' +
            postId
        );
        setQtyCommande(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  //Recupération des informations sur la quantité commandée et payée
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          // `http://localhost:9400/api/products/read/${postId}`
          'http://localhost:9000/api/products/qteCommmandePourUnProductEtPaye/' +
            postId
        );
        setQtyCommandeEtPaye(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  return (
    <div className=" mt-5">
      <Helmet>
        <title> Présentation du Produit</title>
      </Helmet>

      <Container>
        <Row>
          <Col md={6}>
            {' '}
            <h1>
              <Badge bg="success"> Quantité Commandée</Badge>
            </h1>
            <h1>
              <Badge bg="danger"> {qtyCommande} </Badge>
            </h1>
          </Col>
          <Col md={6}>
            {' '}
            <h1>
              <Badge bg="warning"> Quantité Commandée et Payée</Badge>
            </h1>
            <h1>
              <Badge bg="secondary"> {qtyCommandeEtPaye} </Badge>
            </h1>
          </Col>
        </Row>
      </Container>

      <Container className="mt-5">
        {' '}
        <Button className="me-5 my-4 btn_add_product" variant="primary">
          <Link to={`/admin/addBook`} state={post} className="link fs-4">
            {/* state={post} : on prend ttes les infos(id,title,desc,img,date,uid,cat) sur notre post (article) recupérés (en haut par axios) et qui sont contenu dans la variable "post*/}
            Ajouter/Modifier le livre
            <Spinner animation="grow" size="lg" variant="danger" />
          </Link>
        </Button>
        <Row className="mt-5">
          {/* Affichage de l'image */}
          <Col md={3}>
            <div className=" mb-4 survol">
              <img
                src={`../../upload/${post?.img}`}
                alt="Rien à voir"
                className=""
              />
            </div>
            {/* Affichage du bouton mofifier */}

            <Button className="me-5 my-4" variant="outline-info">
              <Link to={`/admin/write`} state={post} className="link">
                {/* state={post} : on prend ttes les infos(id,title,desc,img,date,uid,cat) sur notre post (article) recupérés (en haut par axios) et qui sont contenu dans la variable "post*/}
                Update
              </Link>
            </Button>
            {/* Affichage du bouton Supprimer */}
            <Button
              variant="outline-danger"
              className="my-4 ms-5"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <div className="">
              <h3>
                Crée le :{' '}
                <Badge bg="success"> {post?.createdAt?.substring(0, 10)}</Badge>
              </h3>

              <h3>
                Modifié le:{' '}
                <Badge bg="warning"> {post?.updatedAt?.substring(0, 10)}</Badge>
              </h3>
            </div>
          </Col>

          {/* Description */}
          <Col md={5}>
            <h2>
              <Badge bg="danger"> Description </Badge>
            </h2>
            <span className="desc">{getText(post?.description)}</span>
          </Col>

          {/* Autres Informations */}
          <Col md={4}>
            <h2>
              <Badge bg="success"> Autres Informations </Badge>
            </h2>
            <h3> Name : {post?.name}</h3>
            <h3> Auteur : {post?.author?.name}</h3>
            <h3> Category : {post?.category?.name}</h3>
            <h3> Price : {post?.price}$</h3>
            <h3> Size : {post?.size?.name}</h3>
            <h3> Quantité en Stock : {post?.countInStock}</h3>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
