import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button, Form, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEnrollmentByUserId } from '../redux/slice/enrollmentSlice';
import { Search } from 'react-feather';
import '../css/myCourse.css';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.user);
  const { enrollmentList, status: enrollmentStatus } = useSelector((state) => state.enrollment);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchEnrollmentByUserId(loggedInUser.id));
    }
  }, [dispatch, loggedInUser]);

  // Filter and search logic
  const filteredCourses = enrollmentList.filter((enrollment) => {
    const course = enrollment.courseId; // course bilgisi burada alınıyor
    const matchesSearch = course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (enrollment.progress === 100 ? 'completed' : 'enrolled') === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Container fluid>
      <Row>
        {/* Main Content */}
        <Col md={9} lg={10} className="py-4">
          {/* Search and Filters */}
          <div className="search-container">
            <Row className="align-items-center">
              <Col md={6}>
                <div className="position-relative">
                  <Form.Control
                    type="search"
                    placeholder="Eğitimlerde ara"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="position-absolute" style={{ right: '10px', top: '10px', color: '#6c757d' }} />
                </div>
              </Col>
              <Col md={3}>
                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">Kayıt Durumunu Seçin</option>
                  <option value="enrolled">Kayıtlı</option>
                  <option value="completed">Tamamlandı</option>
                </Form.Select>
              </Col>
            </Row>
          </div>

          {/* Course Cards */}
          <Row>
            {filteredCourses.map((enrollment) => {
              const course = enrollment.courseId; // Her kaydın course bilgisi burada erişiliyor
              return (
                <Col md={6} lg={4} key={enrollment.id} className="mb-4">
                  <Card className="course-card h-100">
                    <Badge
                      bg={enrollment.progress === 100 ? 'success' : 'primary'}
                      className="status-badge"
                    >
                      {enrollment.progress === 100 ? 'Tamamlandı' : 'Kayıtlı'}
                    </Badge>
                    <Card.Img variant="top" src={`http://localhost:8080${course.imageUrl}`} alt={course.title} />
                    <Card.Body>
                      <small className="text-muted">{course.title}</small>
                      <Card.Title className="h5 mt-2">{course.description || 'Açıklama Yok'}</Card.Title>
                      <small className="text-primary">{course.educationDetails || 'Detay Yok'}</small>
                      <div className="mt-3">
                        <small className="text-muted">Tamamlanma durumu</small>
                        <ProgressBar
                          now={enrollment.progress}
                          variant={enrollment.progress === 100 ? 'success' : 'info'}
                          className="mt-2"
                        />
                        <small className="d-block text-end mt-1">%{enrollment.progress}</small>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Button
                        variant="primary"
                        className="btn-start w-100"
                        onClick={() => navigate(`/course/${course.id}`)}
                      >
                        {enrollment.progress === 0
                          ? 'Eğitime başla'
                          : enrollment.progress === 100
                          ? 'Son teste başla'
                          : 'Eğitime devam et'}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default MyCourses;
