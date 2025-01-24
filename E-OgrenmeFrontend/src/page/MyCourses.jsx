import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { fetchEnrollmentByUserId } from "../redux/slice/enrollmentSlice"
import { searchCourses } from "../redux/slice/courseSlice"
import { Search } from "react-feather"
import "../css/myCourse.css"
import { useNavigate } from "react-router-dom"
import { createComment, fetchCommentsByCourseId } from "../redux/slice/commentSlice"

const MyCourses = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [comment, setComment] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loggedInUser } = useSelector((state) => state.user)
  const { courseList } = useSelector((state) => state.course)
  const { enrollmentList, status: enrollmentStatus } = useSelector((state) => state.enrollment)
  const { comments } = useSelector((state) => state.comment)

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchEnrollmentByUserId(loggedInUser.id))
    }
  }, [dispatch, loggedInUser])

  useEffect(() => {
    const fetchMissingComments = async () => {
      for (const enrollment of enrollmentList) {
        if (!comments[enrollment.courseId]) {
          await dispatch(fetchCommentsByCourseId(enrollment.courseId))
        }
      }
    }
    if (enrollmentList.length > 0) fetchMissingComments()
  }, [dispatch, enrollmentList, comments])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(searchCourses({ courseName: searchTerm, category: "" }))
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, dispatch])

  const filteredCourses = enrollmentList.filter((enrollment) => {
    const course = courseList.find((c) => c.id === enrollment.courseId)
    if (!course) return false
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" || (enrollment.progress === 100 ? "completed" : "enrolled") === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCommentSubmit = (courseId) => {
    if (comment.trim()) {
      dispatch(createComment({ courseId, userId: loggedInUser.id, content: comment }))
      setComment("")
    }
  }

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
                  <Search className="position-absolute" style={{ right: "10px", top: "10px", color: "#6c757d" }} />
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
              const course = courseList.find((c) => c.id === enrollment.courseId)
              if (!course) return null
              return (
                <Col md={6} lg={4} key={enrollment.id} className="mb-4">
                  <Card className="course-card h-100">
                    <Badge bg={enrollment.progress === 100 ? "success" : "primary"} className="status-badge">
                      {enrollment.progress === 100 ? "Tamamlandı" : "Kayıtlı"}
                    </Badge>
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080${enrollment.courseImage}`}
                      alt={enrollment.courseTitle}
                    />
                    <Card.Body>
                      <small className="text-muted">{enrollment.courseTitle}</small>
                      <Card.Title className="h5 mt-2">{enrollment.courseDescription || "Açıklama Yok"}</Card.Title>
                      <div className="mt-3">
                        <h6>Yorumlar:</h6>
                        {comments[course.id]?.map((comment) => (
                          <p key={comment.id}>{comment.content}</p>
                        ))}
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleCommentSubmit(course.id)
                        }}
                      >
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Yorumunuzu yazın..."
                          />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-2">
                          Yorum Ekle
                        </Button>
                      </Form>
                      <Button
                        variant="primary"
                        className="btn-start w-100 mt-2"
                        onClick={() => {
                          navigate("/coursevideo/" + course.id)
                        }}
                      >
                        {enrollment.progress === 0
                          ? "Eğitime başla"
                          : enrollment.progress === 100
                            ? "Son teste başla"
                            : "Eğitime devam et"}
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default MyCourses

