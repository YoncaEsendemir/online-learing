import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Handle form submission logic here
    };

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <h1 className="text-center mb-5">İletişim</h1>
                </Col>
            </Row>
            <Row>
                <Col md={6} className="mb-4 mb-md-0">
                    <Card className="shadow-sm h-100">
                        <Card.Body>
                            <h2 className="text-primary mb-4">Bize Ulaşın</h2>
                            <p>Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz.</p>
                            <ul className="contact-info">
                                <li><strong>Adres:</strong> </li>
                                <li><strong>Telefon:</strong> +90 (212) 555 55 55</li>
                                <li><strong>E-posta:</strong> info@e-ogrenme.com</li>
                            </ul>
                            <h3 className="text-primary mt-4 mb-3">Bizi Takip Edin</h3>
                            <div className="social-links">
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="me-3"><FaFacebook size={24} /></a>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="me-3"><FaTwitter size={24} /></a>
                                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={24} /></a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2 className="text-primary mb-4">İletişim Formu</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Adınız</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Adınızı girin"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>E-posta</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="E-postanızı girin"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formMessage">
                                    <Form.Label>Mesajınız</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Mesajınızı buraya yazın"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    Gönder
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;

