import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../redux/slice/categorySlice';
import Loader from '../components/Loading';

function AddCategory({ selectedCategories, setSelectedCategories }) {
  const { categoryList, status: categoryStatus, error: categoryError } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryStatus === 'idle') {
      dispatch(fetchCategory());
    }
  }, [dispatch, categoryStatus]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value, 10);
    
    if (checked) {
      setSelectedCategories([...selectedCategories, { id: categoryId }]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryId));
    }
  };

  if (categoryStatus === 'loading') {
    return <div><Loader message='Veriler Yükleniyor...' /></div>;
  }

  if (categoryStatus === 'failed') {
    return <div className="error">Kategori Hatası: {categoryError}</div>;
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Kategoriler</Form.Label>
      <div className="d-flex flex-column gap-2">
        {categoryList.map(category => (
          <Form.Check
            key={category.id}
            type="checkbox"
            id={`category-${category.id}`}
            label={category.name}
            value={category.id}
            onChange={handleCategoryChange}
            checked={selectedCategories.some(cat => cat.id === category.id)}
          />
        ))}
      </div>
    </Form.Group>
  );
}

export default AddCategory;

