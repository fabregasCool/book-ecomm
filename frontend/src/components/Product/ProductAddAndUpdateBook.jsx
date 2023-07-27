import React, { useEffect, useState } from 'react';
import axios from 'axios';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';
//import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'react-bootstrap/Button';

import { BucketFill } from 'react-bootstrap-icons';

export default function ProductAddAndUpdateBook() {
  // useNavigate
  const navigate = useNavigate();

  //Variable pour recupérer le message d'erreur qui s'affiche dans la console

  const [err, setError] = useState(null);

  const state = useLocation().state; //C'est ce state qui se trouve dans ProducSinglePage.jsx : <Link to={`/write?edit=2`} state={post}>

  //Déclaration des variables

  const [name, setName] = useState(state?.name || ''); //Le Name

  // const [size, setSize] = useState(state?.size || ''); //Le size
  // const [author, setAuthor] = useState(state?.author || ''); //Le size
  // const [category, setCategory] = useState(state?.category || ''); //la catégorie
  const [value, setValue] = useState(state?.description || ''); //C'est ce "value" qui se trouve dans la div "editorContainer" reservée à la descriptioncription de notre article
  const [price, setPrice] = useState(state?.price || ''); //Le price
  const [countInStock, setCountInStock] = useState(state?.countInStock || ''); //La Qté en stock

  //Variable qui affiche la progression de l'upload et les messages
  const [file, setFile] = useState(''); //Le livre
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);

  // const [sizes, setSizes] = useState([]); //Liste de toutes les sizes
  // const [authors, setAuthors] = useState([]); //Liste de toutes les sizes
  // const [categorys, setCategorys] = useState([]); //Liste de toutes les catégories

  // const [name, setName] = useState(state?.name || ""): On inistilalise notre "useState" en lui disant de prendre
  //le nom actuel(dans ce cas c'est une mise à jour); s'il ne trouve pas de nom, c'est que c'est un nouveau post donc
  //on initialise avec une chaine de caractère vide; C'EST PAREIL POUR LES AUTRES VARIABLES

  //Fonction upload image
  const upload = async () => {
    try {
      if (!file) {
        setMsg('No file selected');
        return;
      }
      //Pour télécharger n'importe quel fichier, nous devrions d'abord créerdes données

      const formData = new FormData(); //Ainsi on crée "formData" et c'est à l'intérieur de "formData" que ns allons passer notre fichier 'file'

      //Pour ajouter(passer) notre fichier 'file'à "formData" nous utiliseront la méthode "append"
      formData.append('file', file);
      // "file": c'est notre fichier crée dans index(backend), il reçoit nos images
      //file: designe la varibale de nos images

      setMsg('Uploadind...');

      setProgress((prevState) => {
        return { ...prevState, started: true };
      });

      const res = await axios.post(
        'http://localhost:9000/api/upload/',
        formData,
        {
          onUploadProgress: (progressEvent) => {
            setProgress((prevState) => {
              return { ...prevState, pc: progressEvent.progress * 100 };
            });
          },
          headers: {
            'Custom-Headers': 'value',
          },
        }
      );
      setMsg('Upload Successfully');
      return res.data; //On recupère l'image téléchargée
      //console.log(res.data);
    } catch (err) {
      setMsg('Upload failed');
      console.error(err);
    }
  };

  //Création de la fonction handleClick
  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload(); //Ntre fonction "upload" est stockée dans la variable "imgUrl" ainis on peut l'utiliser dans le reste de la fonction

    try {
      state // On demande s'il ya un "state", si oui, cela signifie que c'est une  page de mise à jour donc on utilise notre route de "update"
        ? await axios.put(
            `http://localhost:9000/api/products/update/${state._id}`,
            {
              name,
              // size,
              // author,
              // category,
              description: value,
              price,
              countInStock,
              book: file ? imgUrl : state.book, //On verifie si la variable(img) contient qqch, si oui on envoie l'URL de l'image(nom + ext); sinon on recupère son ancienne image
              //NB: file est la varaible qui contient l'image
            },
            { withCredentials: true }
          )
        : //Dans le 2nd cas, il n'ya pas de "state" donc on crée un nouveau post
          await axios.post(
            `http://localhost:9000/api/products/create`,
            {
              name,
              // size,
              // author,
              // category,
              description: value,
              price,
              countInStock,
              book: file ? imgUrl : '',
              // date: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), //On envoi egalement la date
            },
            { withCredentials: true }
          );
      navigate('/admin/productlist'); //Si l'article est crée sans problème, on sera dirigé vers la page d'accueil
    } catch (err) {
      setError(err?.response.data.message); //Afiiche l'erreur de la console
      console.log(err);
    }
  };

  // Recuperer tous les size(marques)
  // useEffect(() => {
  //   const fetcchAllSizes = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:9000/api/sizes/list'); //Recupère tous les marques(size)
  //       console.log(res);
  //       setSizes(res.data); //Mettre à jour les marques(size)
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetcchAllSizes();
  // }, []);

  // Recuperer tous les auteurs(authors)
  // useEffect(() => {
  //   const fetcchAllAuthors = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:9000/api/authors/list'); //Recupère tous les marques(size)
  //       console.log(res);
  //       setAuthors(res.data); //Mettre à jour les marques(size)
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetcchAllAuthors();
  // }, []);

  // Recuperer toutes les category
  // useEffect(() => {
  //   const fetcchAllCategorys = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:9000/api/categorys/list'); //Recupère tous les marques(size)
  //       console.log(res);
  //       setCategorys(res.data); //Mettre à jour les marques(size)
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetcchAllCategorys();
  // }, []);

  return (
    <div className="">
      <Helmet>
        <title> Créer ou Modifier un Produit</title>
      </Helmet>
      <div className="mt-5 title_prod">
        <Row>
          <Col md={2}> </Col>
          <Col md={8}>
            <h1> Créer ou Modifier un Produit</h1>
            {/* Affichage de l'erreur */}
            {err && (
              <Button variant="danger" className="my-3">
                {err}
              </Button>
            )}
            {/* Insertion du Nom  */}

            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                {' '}
                <BucketFill color="#000" size={30} className="me-3" />
              </InputGroup.Text>

              <Form.Control
                className="border-5"
                type="text"
                value={name}
                placeholder="Nom Du Produit"
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </InputGroup>

            {/* Insertion de l'éditeur de texte ReactQuill */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Notez une description du produit
              </InputGroup.Text>
            </InputGroup>
            <div className="editorContainer">
              <ReactQuill
                className="editor "
                theme="snow"
                value={value}
                onChange={setValue}
              />
            </div>

            {/* Choisisr un auteur */}
            {/* <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Choisir un auteur
              </InputGroup.Text>

              {authors && (
                <Form.Select
                  className="border-5"
                  aria-label="Default select example"
                  name="author"
                  value={size}
                  onChange={(e) => setAuthor(e.currentTarget.value)}
                >
                  {authors?.map((author) => (
                    <option key={author._id} value={author._id}>
                      {author.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </InputGroup> */}

            {/* Choisisr une taille */}
            {/* <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Choisir une marque
              </InputGroup.Text>

              {sizes && (
                <Form.Select
                  className="border-5"
                  aria-label="Default select example"
                  name="size"
                  value={size}
                  onChange={(e) => setSize(e.currentTarget.value)}
                >
                  {sizes?.map((size) => (
                    <option key={size._id} value={size._id}>
                      {size.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </InputGroup> */}

            {/* Choisisr une catégorie */}
            {/* <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Choisir une catégorie
              </InputGroup.Text>

              {categorys && (
                <Form.Select
                  className="border-5"
                  aria-label="Default select example"
                  name="size"
                  value={category}
                  onChange={(e) => setCategory(e.currentTarget.value)}
                >
                  {categorys?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </InputGroup> */}

            {/* Choisir le Prix */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Choisir un prix
              </InputGroup.Text>
              <Form.Control
                className=""
                type="number"
                value={price}
                placeholder="price"
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </InputGroup>

            {/* Quantité du produit en stock */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Quantité en stock
              </InputGroup.Text>
              <Form.Control
                className=""
                type="number"
                value={countInStock}
                placeholder="Quantité en stock"
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </InputGroup>

            {/* Telecharger l'image */}
            <div>
              <h1>Uploader L'image</h1>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              <button onClick={upload}>Upload</button>
              {progress.started && (
                <progress max="100" value={progress.pc}>
                  {' '}
                </progress>
              )}
              {msg && <span>{msg} </span>}
            </div>
            {/* Bouton Envoyer */}
            <div className="mt-5">
              {file && (
                <Button
                  variant="success"
                  onClick={handleClick}
                  className="btn_send"
                >
                  Envoyer
                </Button>
              )}
            </div>
          </Col>
          <Col md={2}> </Col>
        </Row>
      </div>
    </div>
  );
}
