import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Table, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, deleteUser, editUser } from '../redux/slice/userSlice';
import { fetchEnrollmentByUserId} from '../redux/slice/enrollmentSlice'
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import Loader from '../components/Loading';
import '../css/Profile.css';

function Profile() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({});
  const { enrollmentList, status: enrollmentStatus } = useSelector((state) => state.enrollment);
  const [profileImage, setProfileImage] = useState(null);



  // Kullanıcıyı localStorage'dan al ve fetchUserById çağır
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userInfo = JSON.parse(storedUser);
      if (userInfo.id) {
        dispatch(fetchUserById(userInfo.id));
        dispatch(fetchEnrollmentByUserId(userInfo.id)); // Kullanıcı ID'ye göre
      }
    }
  }, [dispatch]);

  // Kullanıcı bilgilerini profile state'ine yükle
  useEffect(() => {
    if (user) {
      setProfile({
        id: user.id,
        name: user.name || '',
        profilImage: user.profilImage,
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilImage') {
      setProfileImage(files[0]);
    } else {
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user', JSON.stringify(profile));
    if (profileImage) {
      formData.append('profilImage', profileImage);
    }

    dispatch(editUser({ userId: user.id, formData }))
      .unwrap()
      .then(() => {
        setMessage('Profil başarıyla güncellendi.');
        dispatch(fetchUserById(user.id)); // Güncellenmiş veriyi getir
      })
      .catch((err) => {
        setMessage(`Profil güncellenemedi: ${err.message}`);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Hesabı silmek istiyor musunuz?')) {
      dispatch(deleteUser(user.id))
        .unwrap()
        .then(() => {
          setDeleteMessage(`${user.name} kullanıcı başarıyla silindi.`);
          localStorage.removeItem('user');
          setTimeout(() => {
            window.location.href = '/register';
          }, 3000);
        })
        .catch((err) => {
          setMessage(`Hesap silinemedi: ${err.message}`);
        });
    }
  };

  if (status === 'loading') {
    return <Loader message="Veriler yükleniyor..." />;
  }

  if (status === 'failed') {
    return <div className="error">Hata: {error}</div>;
  }

  return (
    <Container fluid className="profile-container">
      <Row>
        <Col md={7} lg={8}>
          <Card className="profile-card">
            <Card.Body>
              <div className="profile-header">
                <h2 className="mb-4">Profil</h2>
                <div className="profile-image-container">
                  {profile.profilImage ? (
                    <Image
                      src={`http://localhost:8080${profile.profilImage}`}
                      roundedCircle
                      className="profile-image"
                      alt="Profil Resmi"
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <FaUser />
                    </div>
                  )}
                </div>
              </div>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ad:</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Soyad:</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bio:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profil Resmi:</Form.Label>
                  <Form.Control
                    type="file"
                    name="profilImage"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button variant="danger" type="button" onClick={handleDelete}>
                    <FaTrash /> Hesap Sil
                  </Button>
                  <Button variant="primary" type="submit">
                    <FaEdit /> Hesap Düzenle
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5} lg={4}>
          <Card className="course-list-card">
            <Card.Body>
              <h3 className="mb-4">Alınan Kurslar</h3>
              <Table striped bordered hover className="course-table">
                <thead>
                  <tr>
                    <th>Kurs Adı</th>
                    <th>İlerleme</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollmentList.map((enrollment) => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.name}</td>
                      <td>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${enrollment.progress}%` }}
                            aria-valuenow={enrollment.progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          >
                            {enrollment.progress}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;

