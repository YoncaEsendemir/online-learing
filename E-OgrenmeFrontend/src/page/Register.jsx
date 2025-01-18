import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { IoSchoolOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../redux/slice/userSlice';
import '../css/register.css';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loggedInUser } = useSelector((state) => state.user); // Redux loggedInUser durumu

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 0,
  });

  useEffect(() => {
    if (loggedInUser) {
      // Eğer kullanıcı zaten giriş yapmışsa, dashboard'a yönlendir
      navigate('/dashboard');
    }
  }, [loggedInUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Şifre Doğrulama
    if (formData.confirmPassword !== formData.password) {
      alert('Şifre eşleşmiyor!');
      return;
    }

    try {
      // Yeni Kullanıcı Ekleme
      console.log(formData);
      const result = await dispatch(createUser(formData)).unwrap();
      alert('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate("/login"); // Kayıt sonrası giriş sayfasına yönlendirme
    } catch (error) {
      alert('Kayıt sırasında bir hata oluştu: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container fluid className="register-container">
      <Card className="register-card">
        <Card.Body>
          <div className="text-center mb-4">
            <IoSchoolOutline size={50} className="logo-icon" />
            <h2>Kayıt Ol</h2>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Ad </Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Adınızı giriniz"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Soyadınızı girin"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>E-posta adresi</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="E-posta adresinizi girin"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Şifre</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Şifrenizi girin"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifre Tekrar</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Kayıt Ol
            </Button>

            <div className="text-center mt-2">
              <p className="mb-0">
                Zaten bir hesabınız var mı?{' '}
                <Link to="/login" className="login-link">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
