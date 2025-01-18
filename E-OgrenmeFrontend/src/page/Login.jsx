import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slice/userSlice';
import { setUser } from '../redux/slice/userSlice';
import { IoSchoolOutline } from "react-icons/io5";
import AppWrapper from '../components/AppWrapper';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loggedInUser, status, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    <AppWrapper/>
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();//
      localStorage.setItem('user', JSON.stringify(response));
      dispatch(setUser(response));
      navigate('/dashboard');
    } catch (error) {
      console.error('Giriş hatası:', error);
    }
  };

  return (
    <Container fluid className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <IoSchoolOutline size={50} />
          <h2>E-Öğrenme Giriş</h2>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-posta:</Form.Label>
            <Form.Control
              type="text"
              placeholder="E-posta adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Şifre:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Şifrenizi girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            {status === 'loading' ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>

          {status === 'failed' && (
            <Alert variant="danger" className="mt-3">
              Giriş Başarısız: {error || 'Geçersiz bilgiler'}
            </Alert>
          )}

          <div className="text-center mb-3">
            <Link to="/forgot-password" className="forgot-password">
              Şifremi Unuttum
            </Link>
          </div>
        </Form>
        <div className="register-link">
          <p>
            Hesabınız yok mu?{' '}
            <Link to="/register" onClick={() => {
              localStorage.clear();
              console.log('LocalStorage temizlendi');
            }}>
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Login;
