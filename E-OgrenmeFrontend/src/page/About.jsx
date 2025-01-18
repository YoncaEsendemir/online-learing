import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';


function About() {
    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <h1 className="text-center mb-5">Hakkımızda</h1>
                </Col>
            </Row>
            <Row>
                <Col md={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h2 className="text-primary mb-4">Misyonumuz ve Vizyonumuz</h2>
                            <p className="lead">"Eğitimi herkes için erişilebilir ve etkili hale getirmek için buradayız."</p>
                            <p>Kullanıcılarımıza kaliteli eğitim materyalleri sunarak öğrenmeyi kolaylaştırmak ve dünyanın en etkili çevrimiçi eğitim platformu olmak hedefindeyiz.</p>
                            
                            <h3 className="text-primary mt-5 mb-3">Değerlerimiz</h3>
                            <ul className="value-list">
                                <li>Şeffaflık</li>
                                <li>Kullanıcı odaklılık</li>
                                <li>Kalite</li>
                                <li>Yenilikçilik</li>
                            </ul>
                            
                            <h3 className="text-primary mt-5 mb-3">Kullanıcıya Katkılarımız</h3>
                            <ul>
                                <li>Kolay erişilebilir kurslar</li>
                                <li>Etkileşimli içerikler</li>
                                <li>Sertifikalı eğitim programları</li>
                            </ul>
                            
                            <h3 className="text-primary mt-5 mb-3">İletişim Bilgileri</h3>
                            <p>E-posta: info@e-ogrenme.com</p>
                            <p>Telefon: +90 (212) 555 55 55</p>
                            <p>Adres: Atatürk Caddesi, No: 123, 34000 İstanbul, Türkiye</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default About;

