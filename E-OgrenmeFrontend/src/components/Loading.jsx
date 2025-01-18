import React from 'react';
import { Spinner } from 'react-bootstrap';
import '../css/loader.css';

const Loader = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="loader-container">
      <Spinner animation="border" role="status" variant="primary" className="loader-spinner" />
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
