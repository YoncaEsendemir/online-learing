import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import '../css/dashboard.css';

const courseProgress = [
  { name: 'React Temelleri', tamamlanan: 80, kalan: 20 },
  { name: 'JavaScript İleri Seviye', tamamlanan: 65, kalan: 35 },
  { name: 'Web Tasarım', tamamlanan: 45, kalan: 55 },
  { name: 'Python Programlama', tamamlanan: 30, kalan: 70 },
];

function Dashboard() {
  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <h1 className="dashboard-title">Hoş Geldiniz, Öğrenci!</h1>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Tamamlanan Kurslar</Card.Title>
              <Card.Text className="dashboard-stat">3</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Devam Eden Kurslar</Card.Title>
              <Card.Text className="dashboard-stat">2</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Öğrenme Saati</Card.Title>
              <Card.Text className="dashboard-stat">42 saat</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Kurs İlerleme Durumu</Card.Title>
              <BarChart width={600} height={300} data={courseProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tamamlanan" stackId="a" fill="#8884d8" />
                <Bar dataKey="kalan" stackId="a" fill="#82ca9d" />
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Son Aktiviteler</Card.Title>
              <ul className="activity-list">
                <li>React Hooks konusu tamamlandı</li>
                <li>JavaScript Asenkron Programlama quiz'i çözüldü</li>
                <li>Web Tasarım projesine başlandı</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Yaklaşan Etkinlikler</Card.Title>
              <ul className="event-list">
                <li>Yarın, 15:00 - Canlı Webinar: İleri Seviye React Teknikleri</li>
                <li>3 gün sonra - JavaScript Proje Teslim Tarihi</li>
                <li>Gelecek hafta - Yeni Python Kursu Başlangıcı</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Button variant="primary">Kurslarıma Git</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
