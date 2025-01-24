import React, { useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrollmentByUserId } from "../redux/slice/enrollmentSlice"
import { useNavigate } from 'react-router-dom';
import { fetchCategory } from '../redux/slice/categorySlice';
import { fetchCourses } from '../redux/slice/courseSlice';
import slider1 from '../sliderImage/slider1.jpg';
import slider2 from '../sliderImage/slider2.jpg';
import slider3 from '../sliderImage/slider3.png';
import Loader from '../components/Loading';
import '../css/home.css';

function Home() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { loggedInUser } = useSelector((state) => state.user)
  const { enrollmentList, status: enrollmentStatus } = useSelector((state) => state.enrollment)
  const { categoryList, status: categoryStatus, error: categoryError } = useSelector((state) => state.category);
  const { courseList, status: courseStatus, error: courseError } = useSelector((state) => state.course);

  useEffect(() => {
    if (categoryStatus === 'idle' && courseStatus === 'idle') {
      dispatch(fetchCategory());
      dispatch(fetchCourses());
    }
  }, [dispatch, categoryStatus,dispatch, courseStatus]);

    useEffect(() => {
      if (loggedInUser) {
        dispatch(fetchEnrollmentByUserId(loggedInUser.id))
      }
    }, [dispatch, loggedInUser])

    /*
  useEffect(() => {
    if (courseStatus === 'idle') {
      dispatch(fetchCourses());
    }
  }, [dispatch, courseStatus]);

 */
  if (categoryStatus === 'loading' || courseStatus === 'loading') {
    return <Loader message="Veriler yükleniyor..." />;
  }

  if (categoryStatus === 'failed') {
    return <div className="error">Kategori Hatası: {categoryError}</div>;
  }

  if (courseStatus === 'failed') {
    return <div className="error">Kurs Hatası: {courseError}</div>;
  }

  return (
    <div className="home-page">
      <Container fluid className="home-container">
        <Carousel className="home-slider">
          <Carousel.Item>
            <img className="d-block w-100" src={slider1} alt="First slide" />
            <Carousel.Caption style={{ color: 'black' }}>
              <h3>Yeni Beceriler Edinin</h3>
              <p>Kariyerinizi ilerletmek için online kurslarımıza göz atın.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={slider2} alt="Second slide" />
            <Carousel.Caption style={{ color: 'black' }}>
              <h3>Uzmanlardan Öğrenin</h3>
              <p>Alanında uzman eğitmenlerimizle bilgilerinizi pekiştirin.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src={slider3} alt="Third slide" />
            <Carousel.Caption style={{ color: 'black' }}>
              <h3>Esnek Öğrenme</h3>
              <p>Kendi hızınızda, istediğiniz yerden öğrenin.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        <Row className="mt-5">
          <Col md={3}>
            <h2 className="mb-4">Kategoriler</h2>
            <ul className="category-list">
              {categoryList && categoryList.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </Col>
          <Col md={9}>
            <h2 className="mb-4">Kurslarım</h2>
            <Row>
              {enrollmentList && enrollmentList.map((enrollment) => (
                <Col md={4} key={enrollment.courseId}>
                  <Card className="mb-4">
                    <div style={{display:'flex' ,justifyContent:"center"}}>
                    <Card.Img variant="top" style={{width:"100px", height:"100px"}} src={`http://localhost:8080${enrollment.courseImage}`} />
                    </div>
                    <Card.Body>
                      <Card.Title>{enrollment.courseTitle} </Card.Title>
                      <Card.Text>{enrollment.courseDescription} </Card.Text>
                      <Button variant="primary"  onClick={()=>{navigate('/coursDetail/'+enrollment.courseId)}}>Kursa Git</Button>
                    </Card.Body>
                    </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        {/*  tüm kurslar geliyor  */}

<Row md={9}>
            <h2 className="mb-4">Tüm Kurslar</h2>
            <Row>
              {courseList && courseList.map((course) => (
                <Col md={4} key={course.id}>
                  <Card className="mb-4">
                    <div style={{display:'flex' ,justifyContent:"center"}}>
                    <Card.Img variant="top" style={{width:"100px", height:"100px"}} src={`http://localhost:8080${course.imageUrl}`} />
                    </div>
                    <Card.Body>
                      <Card.Title>{course.title} </Card.Title>
                      <Card.Text>{course.description} </Card.Text>
                      <Button variant="primary"  onClick={()=>{navigate('/coursDetail/'+course.id)}}>Kursa Git</Button>
                    </Card.Body>
                    </Card>
                </Col>
              ))}
            </Row>
            </Row>
      </Container>
    </div>
  );
}

export default Home;
