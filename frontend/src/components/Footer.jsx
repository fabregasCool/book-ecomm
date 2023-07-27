import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import {
  EnvelopeHeart,
  GeoAltFill,
  Phone,
  PhoneFill,
  Telephone,
  TelephoneFill,
} from 'react-bootstrap-icons';

export default function Footer() {
  return (
    <Container fluid className="my-5">
      <Row>
        <Col md={4}>
          {' '}
          <Card className="border-0" border="" style={{ width: '23rem' }}>
            <Card.Header>
              <h2>ShopBook Description</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis odit optio quae quod quia error expedita nulla aut,
                dolorem vitae dolores repellendus tenetur, debitis veniam. Neque
                adipisci corporis at nobis, reiciendis placeat molestiae?
                Praesentium minima accusamus aut dolorem harum, hic nesciunt
                assumenda illo repudiandae dolores voluptatem fugiat laborum
                architecto ratione porro.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="fs-5 ">
          <Nav defaultActiveKey="/home" className="flex-column">
            <h2 className="redressed">Useful Links</h2>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
          </Nav>
        </Col>
        <Col md={2} className="fs-5 mt-5">
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
          </Nav>
        </Col>
        <Col md={4}>
          {' '}
          <Card className="border-0" border="" style={{ width: '30rem' }}>
            <Card.Header>
              <h2>ShopBook Contact</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <GeoAltFill color="#000" size={30} className="me-3 " />
                622 Dixie Path South Madrid 996214
              </Card.Text>
              <Card.Text>
                <TelephoneFill color="#000" size={30} className="me-3 " />+ 223
                25 56 55 21
              </Card.Text>
              <Card.Text>
                <EnvelopeHeart color="#000" size={30} className="me-3 " />
                shopBook2023@gmail.com
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
