import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveEnrollment } from '../redux/slice/enrollmentSlice';
import '../css/Payment.css';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.user);
  const courseId = location.state?.courseId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loggedInUser && courseId) {
      const enrollmentData = {
        userId: loggedInUser.id,
        courseId: parseInt(courseId),
        enrollmentDate: new Date().toISOString(),
        // Add any other necessary enrollment data
      };

      dispatch(saveEnrollment(enrollmentData))
        .unwrap()
        .then(() => {
          alert('Kurs kaydınız başarıyla tamamlandı!');
          navigate('/dashboard');
        })
        .catch((error) => {
          alert('Kurs kaydı sırasında bir hata oluştu: ' + error);
        });
    } else {
      alert('Kullanıcı girişi yapılmamış veya kurs bilgisi eksik.');
      navigate('/login');
    }
  };

  return (
    <div className="payment-page">
      <Container className="payment-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h2" className="text-center">Ödeme Sayfası</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ödeme Yöntemi</Form.Label>
                    <Form.Select 
                      value={paymentMethod} 
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="credit">Kredi Kartı</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank">Banka Havalesi</option>
                    </Form.Select>
                  </Form.Group>

                  {paymentMethod === 'credit' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Kart Numarası</Form.Label>
                        <Form.Control type="text" placeholder="1234 5678 9012 3456" />
                      </Form.Group>
                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Son Kullanma Tarihi</Form.Label>
                            <Form.Control type="text" placeholder="MM/YY" />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control type="text" placeholder="123" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </>
                  )}

                  {paymentMethod === 'paypal' && (
                    <p>PayPal ile ödeme seçeneği seçildi. PayPal'a yönlendirileceksiniz.</p>
                  )}

                  {paymentMethod === 'bank' && (
                    <p>Banka havalesi seçeneği seçildi. Banka bilgileri size e-posta ile gönderilecektir.</p>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Ad Soyad</Form.Label>
                    <Form.Control type="text" placeholder="Ad Soyad" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>E-posta</Form.Label>
                    <Form.Control type="email" placeholder="ornek@email.com" />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Ödemeyi Tamamla ve Kursa Kaydol
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Payment;

