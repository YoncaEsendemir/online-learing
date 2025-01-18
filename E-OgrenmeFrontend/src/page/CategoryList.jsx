import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaEdit, FaTrash,FaCheck,FaTimes} from 'react-icons/fa';
import { useDispatch, useSelector} from 'react-redux';
import { fetchCategory, deleteCategoryById, editCategory, createCategory } from '../redux/slice/categorySlice';
import Loader from '../components/Loading';
import '../css/category.css';

function CategoryList() {
  const dispatch = useDispatch();
  const { categoryList, status, error } = useSelector((state) => state.category);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategory());
    }
  }, [dispatch, status]);

  if (status == 'loading') {
    return <Loader message="Kategori yükleniyor..." />;
  }

  if (status == 'failed') {
    return <div className="error">Hata: {error}</div>;
  }

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name) {
      dispatch(createCategory(newCategory));
      setNewCategory({ name: '', description: '' });
    }
  };
  
  const handleSaveEdit = (category) => {
    dispatch(editCategory({categoryId: category.id,category}));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteCategoryById(id)).then(() => {
      dispatch(fetchCategory());
    });
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleChange = (e, category) => {
    const { name, value } = e.target;
    const updatedCategory = { ...category, [name]: value };
    const updatedCategoryList = categoryList.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    dispatch({ type: 'category/updateLocal', payload: updatedCategoryList });
  };

  return (
    <Container fluid className="category-container">
      <Row className="mb-4">
        <Col md={12} lg={4}>
          <Card className="add-category-card">
            <Card.Header as="h5">Yeni Kategori Ekle</Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddCategory}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategori Ad</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Kategori Ad girin "
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Açıklama</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Kategori açıklamasını girin"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Kategori Ekle
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} lg={8}>
          <Card className="category-list-card">
            <Card.Header as="h5">Kategoriler</Card.Header>
            <Card.Body>
              <Table responsive hover className="category-table">
                <thead>
                  <tr>
                    <th>Ad</th>
                    <th>Açıklama</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map(category => (
                    <tr key={category.id}>
                      <td>
                        {editingId === category.id ? (
                          <Form.Control
                            type="text"
                            name="name"
                            value={category.name}
                            onChange={(e) => handleChange(e, category)}
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td>
                        {editingId === category.id ? (
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="description"
                            value={category.description}
                            onChange={(e) => handleChange(e, category)}
                          />
                        ) : (
                          category.description
                        )}
                      </td>
                      <td>
                        {editingId === category.id ? (
                          <>
                            <Button variant="success" size="sm" className="me-2" onClick={() => handleSaveEdit(category)}>
                              <FaCheck /> Kaydet
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                              <FaTimes /> İptal
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(category.id)}>
                              <FaEdit /> Düzenle
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category.id)}>
                              <FaTrash /> Sil
                            </Button>
                          </>
                        )}
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

export default CategoryList;

