import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../page/Home';
import Login from '../page/Login';
import Register from '../page/Register';
import Contact from '../page/Contact';
import About from '../page/About';
import UserList from '../page/UserList';
import Dashboard from '../page/Dashboard';
import AddCourse from '../page/AddCourse';
import CourseList from '../page/CourseList';
import CategoryList from '../page/CategoryList';
import UpdateCourse from '../page/updateCourse';
import Profile from '../page/Profile';
import CourseDetail from '../page/CourseDetail';
import Payment from '../page/Payment';
import SidebarLayout from '../components/SidebarLayout';
import AppWrapper from '../components/AppWrapper';
import MyCourse from '../page/MyCourses';
import CoursVideo from '../page/CoursVideos';

function RouterConfig() {
  return (
    <Routes>
      {/* Genel Erişim Rotası */}
      <Route path='/' element={<Home />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/about' element={<About />} />
      <Route path='/register' element={<Register />} />
      <Route path='/coursDetail/:courseId' element={<CourseDetail />} />
      <Route path='/login' element={<Login />} />

      {/* Tek kullanıcı ve Admin erişebilir */}
      <Route path='/userlist' element={<AppWrapper><SidebarLayout><UserList /></SidebarLayout></AppWrapper>} />
      <Route path='/dashboard' element={<AppWrapper><SidebarLayout><Dashboard /></SidebarLayout></AppWrapper>} />
      <Route path='/addCourse' element={<AppWrapper><SidebarLayout><AddCourse /></SidebarLayout></AppWrapper>} />
      <Route path='/courseList' element={<AppWrapper><SidebarLayout><CourseList /></SidebarLayout></AppWrapper>} />
      <Route path='/courseUpdate/:courseId' element={<AppWrapper><SidebarLayout><UpdateCourse /></SidebarLayout></AppWrapper>} />
      <Route path='/categoryList' element={<AppWrapper><SidebarLayout><CategoryList /></SidebarLayout></AppWrapper>} />
      <Route path='/profile' element={<AppWrapper><SidebarLayout><Profile /></SidebarLayout></AppWrapper>} />
      <Route path='/myCourse' element={<AppWrapper><SidebarLayout><MyCourse /></SidebarLayout></AppWrapper>} />
      <Route path='/coursevideo/:courseId' element={<AppWrapper><SidebarLayout><CoursVideo /></SidebarLayout></AppWrapper>} />
      <Route path='/payment' element={<AppWrapper><Payment /></AppWrapper>} />

      {/* 404 Yönlendirme */}
      <Route path="*" element={<h1>404 - Sayfa Bulunamadı</h1>} />
    </Routes>
  );
}

export default RouterConfig;
