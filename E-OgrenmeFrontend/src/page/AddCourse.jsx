import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { creatCourse } from '../redux/slice/courseSlice';
import AddCategory from './AddCategory';
import Material from './Material';
import '../css/AddCourse.css';

const AddCourse = () => {
  const dispatch = useDispatch();
  const [course, setCourse] = useState({
    title: '',
    educationDetails: '',
    description: '',
    price: '',
    imageFile: null,
    videoFile: null,
    categories: [],
    materials: [],
    videos: [],
  });

  const editorRefEducationDetails = useRef(null);

  useEffect(() => {
    if (editorRefEducationDetails.current) {
      CKEDITOR.replace('educationDetails', {
        height: 200,
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
      setCourse(prev => ({ ...prev, educationDetails: data }));
    });

    return () => {
      if (CKEDITOR.instances.educationDetails) {
        CKEDITOR.instances.educationDetails.destroy();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setCourse((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleAddVideo = () => {
    setCourse((prev) => ({
      ...prev,
      videos: [...prev.videos, { title: '', duration: '' }],
    }));
  };

  const handleVideoChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVideos = [...course.videos];
    updatedVideos[index] = { ...updatedVideos[index], [name]: value };
    setCourse((prev) => ({ ...prev, videos: updatedVideos }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const courseData = {
        title: course.title,
        educationDetails: CKEDITOR.instances.educationDetails ? CKEDITOR.instances.educationDetails.getData() : '',
        description: course.description,
        price: parseFloat(course.price),
        categories: course.categories.map(category => ({ id: Number(category.id) })),
        materials: course.materials,
        videos: course.videos.map(video => ({
          ...video,
          duration: Number(video.duration)
        })),
      };

      formData.append('course', JSON.stringify(courseData));

      if (course.imageFile) {
        formData.append('imageUrl', course.imageFile);
      } else {
        throw new Error('Lütfen bir resim dosyası seçin.');
      }

      if (course.videoFile) {
        formData.append('url', course.videoFile);
      } else {
        throw new Error('Lütfen bir video dosyası seçin.');
      }

      const result = await dispatch(creatCourse(formData));

      if (creatCourse.fulfilled.match(result)) {
        alert('Kurs başarıyla oluşturuldu!');
        setCourse({
          title: '',
          educationDetails: '',
          description: '',
          price: '',
          imageFile: null,
          videoFile: null,
          categories: [],
          materials: [],
          videos: [],
        });
        if (CKEDITOR.instances.educationDetails) {
          CKEDITOR.instances.educationDetails.setData('');
        }
      }
    } catch (error) {
      console.error('Kurs oluşturma hatası:', error);
      alert(`Hata: ${error.message}`);
    }
  };

  return (
    <Container className="course-creation-page">
      <h1 className="text-center mb-4">Yeni Kurs Oluştur</h1>
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Kurs Başlığı</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={course.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={course.description}
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
                defaultValue={course.educationDetails}
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
                    value={course.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Resim</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageFile"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Video</Form.Label>
                  <Form.Control
                    type="file"
                    name="videoFile"
                    onChange={handleFileChange}
                    accept="video/*"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <h5>Videolar</h5>
                {course.videos.map((video, index) => (
                  <div key={index} className="mb-3">
                    <Form.Group>
                      <Form.Label>Video Başlığı</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={video.title}
                        onChange={(e) => handleVideoChange(index, e)}
                        placeholder="Video başlığını girin"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Video Süresi (saniye)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={video.duration}
                        onChange={(e) => handleVideoChange(index, e)}
                        placeholder="Video süresini girin"
                      />
                    </Form.Group>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddVideo}
                  variant="secondary"
                >
                  Video Ekle
                </Button>
              </Col>
            </Row>

            <AddCategory
              selectedCategories={course.categories}
              setSelectedCategories={(newCategories) =>
                setCourse((prev) => ({ ...prev, categories: newCategories }))
              }
            />
          </Card.Body>
        </Card>

        <Material
          materials={course.materials}
          setMaterials={(newMaterials) =>
            setCourse((prev) => ({ ...prev, materials: newMaterials }))
          }
        />

        <div className="text-center mt-4">
          <Button variant="primary" type="submit" size="lg">
            Kurs Oluştur
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddCourse;

