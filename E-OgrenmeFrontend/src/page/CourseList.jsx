import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, deleteCourse } from '../redux/slice/courseSlice';
import Loader from '../components/Loading';

function CourseList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseList, status, error } = useSelector((state) => state.course);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [dispatch, status]);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course); // Silinecek kursu set et
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (courseToDelete) {
      try {
        await dispatch(deleteCourse(courseToDelete.id)).unwrap(); // Kurs ID'sini gönder
        dispatch(fetchCourses()); // Listeyi güncelle
      } catch (err) {
        console.error('Silme işlemi başarısız oldu:', err);
      } finally {
        setShowDeleteModal(false);
      }
    }
  };
/*
  const handleUpdateClick = (courseId) => {
    navigate('/updateCourse', { state: { courseId } });
  };*/

  if (status === 'loading') {
    return <Loader message="Kurslar yükleniyor..." />;
  }

  if (status === 'failed') {
    return <div className="error">Hata: {error}</div>;
  }

  return (
    <Container>
      <h2 className="my-4">Course List</h2>
      <Link to="/addCourse" className="btn btn-primary mb-3">
        Add New Course
      </Link>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Image</th>
            <th>Eğitim Amacı</th>
            <th>Eğitim Özeti</th>
            <th>Açıklama</th>
            <th>Price</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseList.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>
                <img
                  src={`http://localhost:8080${course.imageUrl}`}
                  alt="Course"
                  style={{ width: '150px', height: '100px', marginLeft: '50px' }}
                />
              </td>
              <td>{course.educationSummary}</td>
              <td>{course.educationalPurpose}</td>
              <td>{course.description}</td>
              <td>${course.price}</td>
              <td>{new Date(course.createdAt).toLocaleDateString('tr-TR')}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={()=>{navigate('/courseUpdate/'+course.id)}}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(course)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Silme Onayı Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Kurs Silme Onayı</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {courseToDelete
            ? `${courseToDelete.title} kursunu silmek istediğinizden emin misiniz?`
            : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CourseList;
