import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loading';
import '../css/PageContainer.css';

function PageContainer({ children }) {
  const location = useLocation();
  const pathsWithSidebar = ['/dashboard', '/userlist', '/profile', '/addCourse', '/courseList', '/categoryList','/courseUpdate/:courseId'];
  const shouldShowSidebar = pathsWithSidebar.includes(location.pathname);

  return (
    <div className="page-container">
      <Header />
      <div className="content-wrapper">
        {shouldShowSidebar && <Sidebar />}
        <main className={`main-content ${shouldShowSidebar ? 'with-sidebar' : ''}`}>
          <Container fluid>
            {children}
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default PageContainer;

