import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';

function Material({ materials, setMaterials }) {
  //const [file, setFile] = useState(null); // setFile hatasını giderdik

  const addMaterial = () => {
    setMaterials([...materials, { title: '', type: ''}]);
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = materials.map((material, i) =>
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
  };

  /*
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    const updatedMaterials = materials.map((material, i) =>
      i === index ? { ...material, file } : material
    );
    setMaterials(updatedMaterials);
  };*/

  const removeMaterial = (index) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Kurs Materyalleri</Card.Title>
        {materials.map((material, index) => (
          <Row key={index} className="mb-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Materyal Başlığı"
                value={material.title}
                onChange={(e) => updateMaterial(index, 'title', e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                as="select"
                value={material.type}
                onChange={(e) => updateMaterial(index, 'type', e.target.value)}
              >
                <option value="">Tür Seçin</option>
                <option value="PDF">PDF</option>
                <option value="SLIDE">Slayt</option>
              </Form.Control>
            </Col>
            {/*
            <Col md={3}>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                accept="application/pdf,application/vnd.ms-powerpoint"
              />
            </Col>*/}
            <Col md={2}>
              <Button variant="danger" onClick={() => removeMaterial(index)}>
                <FaTrash />
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={addMaterial}>
          <FaPlus /> Materyal Ekle
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Material;