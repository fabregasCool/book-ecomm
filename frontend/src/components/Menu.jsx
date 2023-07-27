import '../style/Menu.css';

import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Cart, ToggleOn } from 'react-bootstrap-icons';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import MessageBox from './MessageBox';

function Menu() {
  //
  // Variable offcanvas sur le site react-bootstrap
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // Fin offcanvas

  // Variable categories qui se trouve dans chaque produit (qui va s'afficher dans le offcanvas)
  const [categorys, setCategorys] = useState([]);

  // Recuperer toutes les category
  useEffect(() => {
    const fetcchAllCategorys = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/categorys/list`); //Recupère tous les marques(brand)
        //console.log(res);
        setCategorys(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        //console.log(err);
        toast.error(getError(err));
      }
    };
    fetcchAllCategorys();
  }, []);

  //UseContext afin d'avoir d'avoir accèès aux inforamtions stockés dans le Store (api context) ainsi afficher les articles dans le cart(panier)
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state; //cart et userInfo sont les infos qu'on recupère du local storage; Grace à "userInfo" on peut afficher les infos de l'user comme son nom

  //Deconnexion
  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' }); //Appel de l'action de "Déconnexion"
    localStorage.removeItem('userInfo'); //Effacer les infos de l'utilisateur dans le local storage
    localStorage.removeItem('shippingAddress'); //Effacer les données du form ShippingAddressScreen
    localStorage.removeItem('paymentMethod'); //Effacer les données concernant notre choix de methode de paiment
    localStorage.removeItem('cartItems'); //Effacer tous les articles qui sont dans le panier avant la deconnexion
    window.location.href = '/signin'; //Evite erreur lorsqu'on se déconnecte
  };
  return (
    <Navbar bg="warning" expand="sm">
      {/* expand="lg": si ce n'est pas défini, le bouton de scroll du mobile s'affiche */}
      <Container fluid>
        <Navbar.Brand href="/">
          <span className="logo">
            Shop<strong>Book</strong>
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-5 my-2 my-lg-0"
            style={{ maxHeight: '90px' }}
            navbarScroll
          >
            <Nav.Link href="/cart" className="me-5">
              {/* Partie qui affiche nombre d'articles dans le panier */}
              <div className="cart">
                <div>
                  <Cart color="#000" size={45} className=" my-2 " />
                </div>
                <h3 className="mt-3">
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {/* Affiche le Badge à condition qu' il y ait au moins un article dans le panier et ensuite sa quantité*/}
                      {/* {cart.cartItems.length} */}
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      {/* Affiche la quantité quand on clique sur Add To Cart*/}
                    </Badge>
                  )}
                </h3>
              </div>

              {/* Partie qui affiche les articles qui sont dans le panier */}
              {cart.cartItems.length === 0 ? (
                <MessageBox>Cart is empty.</MessageBox>
              ) : (
                // Le cas où le panier  n'est pas vide, on affiche la liste des articles
                <NavDropdown title="" id="basic-nav-dropdown">
                  {cart.cartItems.map((item) => (
                    <Link className="dropdown-item" to="/cart">
                      <div key={item._id}>
                        {/* Image de l'article ou cartItems */}

                        <img
                          src={`../../upload/${item?.img}`}
                          alt={item?.name}
                          className="rounded-1 img_cart_menu"
                        />
                        <span className="elem_panier">
                          Price: ${item.price}{' '}
                        </span>
                        <span className="elem_panier">
                          Qauntity: {item.quantity}
                        </span>
                      </div>
                    </Link>
                  ))}
                </NavDropdown>
              )}
              <NavDropdown.Divider />
            </Nav.Link>

            {/* Affiche le nom de l'utilisateur connecté */}
            {userInfo ? (
              <NavDropdown
                title={`Bienvenu(e)  ${userInfo?.name}`}
                id="basic-nav-dropdown"
                className="user_menu fs-3 "
              >
                <Link className="dropdown-item fs-4" to="/profile">
                  User Profile
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/orderHistory">
                  Order History
                </Link>
                <NavDropdown.Divider />
                {/* Deconnexion */}

                <Link
                  className="dropdown-item fs-4"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Deconnexion
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link fs-3 mt-4" to="/signin">
                Sign In
              </Link>
            )}

            {/* Afficher le Menu admin */}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown
                title="Admin"
                id="basic-nav-dropdown"
                className="admin_menu fs-3"
              >
                <Link className="dropdown-item fs-4" to="/admin/dashboard">
                  Dashboard
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/productlist">
                  Products
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/orderList">
                  Orders
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/userList">
                  Users
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/sizeList">
                  Size
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/categoryList">
                  Category
                </Link>
                <NavDropdown.Divider />
                <Link className="dropdown-item fs-4" to="/admin/authorList">
                  Author
                </Link>
              </NavDropdown>
            )}
          </Nav>

          {/* Partie offCanvas */}
          {/* <Button variant="primary" onClick={handleShow}> Launch</Button>*/}
          <ToggleOn
            color="#000"
            size={50}
            className=" offCanvas"
            onClick={handleShow}
          />

          {/* La partie du code qui affiche la boite sur le côte */}
          <Offcanvas show={show} onHide={handleClose} className="">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title className="fs-5 fw-bold text-uppercase">
                Informations de l'entreprise
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div>Catégories</div>
              <div>
                {categorys.map((cat) => (
                  <p key={cat}>
                    <Link to={`/search?category=${cat}`}>{cat.name} </Link>
                  </p>
                ))}
              </div>

              <div className="fs-5 my-2 fw-bold ">
                © 2021 En Toute Sécurité. Tous Droits Réservés.
                <Link to="/cart" className="mx-3">
                  Patriote{' '}
                </Link>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
