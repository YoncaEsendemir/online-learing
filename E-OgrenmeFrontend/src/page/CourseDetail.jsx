import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Button, Tab, Tabs, ListGroup, Image } from 'react-bootstrap'
import { FaRegClock, FaUserGraduate } from 'react-icons/fa'
import { fetchCourseById } from '../redux/slice/courseSlice';
import { fetchEnrollmentByCourseId } from '../redux/slice/enrollmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../css/coursDetails.css'

function CourseDetail() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.user);
  const { course, status: courseStatus, error: courseError } = useSelector((state) => state.course);
  const { enrollmentList, status: enrollmentStatus } = useSelector((state) => state.enrollment);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
      dispatch(fetchEnrollmentByCourseId(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (loggedInUser && enrollmentList.length > 0) {
      const userEnrollment = enrollmentList.find(
        enrollment => enrollment.userId === loggedInUser.id && enrollment.courseId === parseInt(courseId)
      );
      setIsEnrolled(!!userEnrollment);
    }
  }, [loggedInUser, enrollmentList, courseId]);

  const handleEnroll = () => {
    if (!loggedInUser) {
      navigate('/register');
    } else if (isEnrolled) {
      navigate('/dashboard');
    } else {
      navigate('/payment', { state: { courseId } });
    }
  }

  if (courseStatus === 'failed') {
    return <div className="error">Kurs Hatası: {courseError}</div>;
  }

  if (courseStatus === 'loading' || enrollmentStatus === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="py-8">
        <Container>
          <Row className="g-4">
            {/* Course Hero Section */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="position-relative mb-4" style={{ height: '300px' }}>
                    <Image
                      style={{ height: '250px', width: '250px' }}
                      src={`http://localhost:8080/${course?.imageUrl}`}
                      alt="Course Cover"
                      className="rounded-3 object-cover"
                    />
                    <Badge
                      bg="primary"
                      className="position-absolute top-0 end-0 m-3"
                    >
                      KATILIM SERTİFİKALI
                    </Badge>
                  </div>

                  <h1 className="text-3xl font-bold mb-4">
                    {course?.title || "Kurs Başlığı"}
                  </h1>

                  <div className="flex items-center gap-4 mb-4 text-gray-600">
                    <div className="flex items-center">
                      <FaRegClock className="me-2" />
                      <span>{new Date(course?.createdAt).toLocaleDateString('tr-TR') || "Kurs oluşturma tarihi"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUserGraduate className="me-2" />
                      <span>{enrollmentList.length} Katılımcı</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Course Action Card */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
                <Card.Body>
                  <div className="text-center mb-4">
                    <h3 className="text-4xl font-bold text-primary mb-2">{`₺${course?.price}` || "Kurs Fiyatı"}</h3>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100"
                      onClick={handleEnroll}
                    >
                      {isEnrolled ? 'Kursa Git' : 'Şimdi Katıl'}
                    </Button>
                  </div>
                  <ListGroup variant="flush">
                    <ListGroup.Item>✓ Ömür Boyu Erişim</ListGroup.Item>
                    <ListGroup.Item>✓ Mobil ve TV Erişimi</ListGroup.Item>
                    <ListGroup.Item>✓ Katılım Sertifikası</ListGroup.Item>
                    <ListGroup.Item>✓ Kaynak Dosyaları</ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Course Content Tabs */}
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Tabs defaultActiveKey="about" className="mb-4">
                    <Tab eventKey="about" title="Açıklama">
                      <h4 className="font-bold mb-3">Eğitim Açıklama</h4>
                      <p>{course?.description || "Kurs Açıklaması"}</p>

                      <div
                        className="text-gray-600 mb-4"
                        dangerouslySetInnerHTML={{ __html: course?.educationDetails || "Eğitim Özeti" }}
                      ></div>
                    </Tab>
                    <Tab eventKey="content" title="İçerik">
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-0">1. Giriş</h6>
                            <small className="text-muted">{course?.duration || "Kayıt Süresi"}</small>
                          </div>
                          <Badge bg="primary" pill>Ücretsiz</Badge>
                        </ListGroup.Item>
                        {/* Add more content items as needed */}
                      </ListGroup>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  )
}

export default CourseDetail

