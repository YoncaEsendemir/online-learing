import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button, ListGroup, Badge } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchEnrollmentByUserId, fetchAllEnrollments } from "../redux/slice/enrollmentSlice"
import { fetchCourses } from "../redux/slice/courseSlice"
import { fetchUsers } from "../redux/slice/userSlice"
import { fetchCategory } from "../redux/slice/categorySlice"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "../css/dashboard.css"

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loggedInUser } = useSelector((state) => state.user)
  const { enrollmentList } = useSelector((state) => state.enrollment)
  const { courseList } = useSelector((state) => state.course)
  const { users } = useSelector((state) => state.user)
  const { categoryList } = useSelector((state) => state.category)

  const [courseProgress, setCourseProgress] = useState([])

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser.role === 1) {
        dispatch(fetchAllEnrollments())
        dispatch(fetchUsers())
        dispatch(fetchCategory())
      } else {
        dispatch(fetchEnrollmentByUserId(loggedInUser.id))
      }
      dispatch(fetchCourses())
    }
  }, [dispatch, loggedInUser])

  useEffect(() => {
    if (enrollmentList.length > 0 && courseList.length > 0) {
      const progress = enrollmentList.map((enrollment) => {
        const course = courseList.find((c) => c.id === enrollment.courseId)
        return {
          name: course ? course.title : "Unknown Course",
          tamamlanan: enrollment.progress,
          kalan: 100 - enrollment.progress,
        }
      })
      setCourseProgress(progress)
    }
  }, [enrollmentList, courseList])

  const renderAdminDashboard = () => (
    <>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Kurs Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{courseList.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Kullanıcı Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{users.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Kategori Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{categoryList.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Kayıt Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{enrollmentList.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Son Eklenen Kurslar</Card.Title>
              <ListGroup variant="flush">
                {courseList
                  .slice(-5)
                  .reverse()
                  .map((course) => (
                    <ListGroup.Item key={course.id}>
                      {course.title}
                      <Badge bg="primary" className="float-end">
                        {course.price} TL
                      </Badge>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Son Kayıt Olan Kullanıcılar</Card.Title>
              <ListGroup variant="flush">
                {users
                  .slice(-5)
                  .reverse()
                  .map((user) => (
                    <ListGroup.Item key={user.id}>
                      {user.name} {user.surname}
                      <Badge bg="secondary" className="float-end">
                        {user.role}
                      </Badge>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )

  const renderUserDashboard = () => (
    <>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Alınan Kurs Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{enrollmentList.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Tamamlanan Kurs Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">
                {enrollmentList.filter((e) => e.progress === 100).length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Devam Eden Kurs Sayısı</Card.Title>
              <Card.Text className="dashboard-stat">{enrollmentList.filter((e) => e.progress < 100).length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Kurs İlerlemesi</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tamamlanan" stackId="a" fill="#8884d8" />
                  <Bar dataKey="kalan" stackId="a" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )

  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <h1 className="dashboard-title">Hoş Geldiniz, {loggedInUser?.name}</h1>
        </Col>
      </Row>
      {loggedInUser?.role ===1 ? renderAdminDashboard() : renderUserDashboard()}
      <Row className="mt-4">
        <Col>
          <Button variant="primary" onClick={() => loggedInUser?.role === 1 ? navigate("/courseList") : navigate("/myCourse")}>
            {loggedInUser?.role === 1 ? "Kurs Yönetimi" : "Kurslarıma Git"}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard

