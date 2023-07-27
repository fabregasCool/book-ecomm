import React, { useContext, useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';

import Form from 'react-bootstrap/Form';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store); //Tjrs cette ligne afin d'avoir aux données stockées dans local storage

  const {
    cart: { shippingAddress, paymentMethod },
  } = state; //on recupère le form shippingAddess et la methode de paiement (paymentMethod)

  //Declaclaration de variable (Par defaut paypal sera selectionné)
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  //UseEffect(Si shippingAddress n'existe pas alors le diriger ver la page shipping)
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  //Fonction submitHandler
  const submitHandler = (e) => {
    //e.preventdefault();//Crre des bugs mais il a mi dans son code
    ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName); //Enregister la methode dans le local storage
    navigate('/placeorder');
  };

  return (
    <div>
      <div className="container small-container">
        <Helmet>
          <title> Payment Method</title>
        </Helmet>
        <Container>
          <CheckoutSteps step1 step2 step3></CheckoutSteps>
          <Row>
            <Col md={3}></Col>
            <Col md={6} className="mt-3">
              <h1 className="my-3"> Payment Method</h1>
              <Form onSubmit={submitHandler}>
                <div className="mb-3">
                  <input
                    type="radio"
                    id="PayPal"
                    label="PayPal"
                    value="PayPal"
                    checked={paymentMethodName === 'PayPal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label>Paypal</label>
                </div>
                <div className="mb-3">
                  <input
                    type="radio"
                    id="Stripe"
                    label="Stripe"
                    value="Stripe"
                    checked={paymentMethodName === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label>Stripe</label>
                </div>
                <div className="mb-3">
                  <Button variant="primary" type="submit">
                    Continue
                  </Button>
                </div>
              </Form>
            </Col>
            <Col md={3}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
