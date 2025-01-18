import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, updateCourse } from '../redux/slice/courseSlice';
import { addVideo, fetchVideoByCoursId } from '../redux/slice/videoSlice';
import AddCategory from './AddCategory';
import Material from './Material';
import '../css/AddCourse.css';

const UpdateCourse = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course, status: courseStatus, error: courseError } = useSelector((state) => state.course);
  const { videoList, status: videoStatus, error: videoError } = useSelector((state) => state.video);
  const [courseUpdate, setCourseUpdate] = useState({
    title: '',
    description: '',
    educationDetails: '',
    price: '',
    imageUrl: null,
    categories: [],
    materials: [],
  });
  const [newVideo, setNewVideo] = useState({
    title: '',
    duration: '',
    file: null
  });
  
  const editorRefEducationDetails = useRef(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
      dispatch(fetchVideoByCoursId(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (course) {
      setCourseUpdate({
        title: course.title || '',
        description: course.description || '',
        educationDetails: course.educationDetails || '',
        price: course.price || '',
        imageUrl: course.imageUrl || null,
        categories: course.categories || [],
        materials: course.materials || [],
      });
    }
  }, [course]);

  useEffect(() => {
    if (editorRefEducationDetails.current) {
      CKEDITOR.replace('educationDetails', {
        height: 150,
        toolbar: [
          ['Bold', 'Italic', 'Underline'],
          ['NumberedList', 'BulletedList'],
          ['Link', 'Unlink'],
          ['Image', 'Table', 'HorizontalRule']
        ]
      });
    }

    CKEDITOR.instances.educationDetails.on('change', function() {
      const data = CKEDITOR.instances.educationDetails.getData();
      setCourseUpdate(prev => ({ ...prev, educationDetails: data }));
    });

    return () => {
      if (CKEDITOR.instances.educationDetails) {
        CKEDITOR.instances.educationDetails.destroy();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCourseUpdate((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNewVideoChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file' && files && files[0]) {
      setNewVideo((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setNewVideo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideo.file || !newVideo.title || !newVideo.duration) {
      alert('Lütfen tüm video bilgilerini doldurun.');
      return;
    }

    const formData = new FormData();
    formData.append('video', newVideo.file);
    formData.append('title', newVideo.title);
    formData.append('duration', newVideo.duration);

    try {
      const resultAction = await dispatch(addVideo({ courseId, formData }));
      if (addVideo.fulfilled.match(resultAction)) {
        alert('Video başarıyla eklendi!');
        setNewVideo({ title: '', duration: '', file: null });
        dispatch(fetchVideoByCoursId(courseId));
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      console.error('Video ekleme hatası:', error);
      alert(`Hata: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const educationDetailsContent = CKEDITOR.instances.educationDetails 
        ? CKEDITOR.instances.educationDetails.getData() 
        : courseUpdate.educationDetails;

      const courseData = {
        title: courseUpdate.title,
        educationDetails: educationDetailsContent,
        description: courseUpdate.description,
        price: parseFloat(courseUpdate.price),
        categories: courseUpdate.categories,
        materials: courseUpdate.materials,
      };

      formData.append('course', JSON.stringify(courseData));

      if (courseUpdate.imageUrl instanceof File) {
        formData.append('imageUrl', courseUpdate.imageUrl);
      } else if (courseUpdate.imageUrl) {
        formData.append('imageUrl', courseUpdate.imageUrl);
      }

      const result = await dispatch(updateCourse({ id: courseId, formData }));

      if (updateCourse.fulfilled.match(result)) {
        alert('Kurs başarıyla güncellendi!');
        navigate('/');
      }
    } catch (error) {
      console.error('Kurs güncelleme hatası:', error);
      alert(`Hata: ${error.message}`);
    }
  };

  if (courseStatus === 'loading') {
    return <div>Yükleniyor...</div>;
  }

  if (courseStatus === 'failed') {
    return <div>Hata: {courseError}</div>;
  }

  return (
    <Container className="course-update-page">
      <h1 className="text-center mb-4">Kurs Güncelle</h1>
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Kurs Başlığı</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={courseUpdate.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={courseUpdate.description}
                onChange={handleInputChange}
                rows={2}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Eğitim Ayrıntı</Form.Label>
              <textarea
                id="educationDetails"
                name="educationDetails"
                defaultValue={courseUpdate.educationDetails}
                ref={editorRefEducationDetails}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fiyat</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={courseUpdate.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  {courseUpdate.imageUrl && (
                    <Image
                      src={courseUpdate.imageUrl instanceof File 
                        ? URL.createObjectURL(courseUpdate.imageUrl)
                        : `http://localhost:8080/${courseUpdate.imageUrl}`}
                      alt="Course Cover"
                      className="mb-2"
                      style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }}
                    />
                  )}
                  <Form.Control
                    type="file"
                    name="imageUrl"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </Form.Group>
              </Col>
            </Row>

            <AddCategory
              selectedCategories={courseUpdate.categories}
              setSelectedCategories={(newCategories) =>
                setCourseUpdate((prev) => ({ ...prev, categories: newCategories }))
              }
            />
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <h5>Videolar</h5>
            {videoList.map((video, index) => (
              <div key={index} className="mb-3">
                <p>Video Başlığı: {video.title}</p>
                <p>Video Süresi: {video.duration} saniye</p>
              </div>
            ))}
            <Form onSubmit={handleAddVideo}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Başlığı</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={newVideo.title}
                      onChange={handleNewVideoChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Süresi (saniye)</Form.Label>
                    <Form.Control
                      type="number"
                      name="duration"
                      value={newVideo.duration}
                      onChange={handleNewVideoChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Dosyası</Form.Label>
                    <Form.Control
                      type="file"
                      name="file"
                      onChange={handleNewVideoChange}
                      accept="video/*"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="secondary">
                Video Ekle
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Material
          materials={courseUpdate.materials}
          setMaterials={(newMaterials) =>
            setCourseUpdate((prev) => ({ ...prev, materials: newMaterials }))
          }
        />

        <div className="text-center mt-4">
          <Button variant="primary" type="submit" size="lg">
            Kurs Güncelle
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateCourse;

