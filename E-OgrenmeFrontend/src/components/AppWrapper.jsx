import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slice/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

function AppWrapper({ children }) {
  const { loggedInUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // localStorage'dan kullanıcıyı al ve Redux'a yükle
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && !loggedInUser) {
      dispatch(setUser(storedUser));

    }
    // Kullanıcı yoksa ve korumalı bir sayfadaysa login sayfasına yönlendir
    if (!storedUser && !loggedInUser && isProtectedRoute(location.pathname)) {
      navigate('/login', { replace: true });
    }
  }, [loggedInUser, dispatch, navigate, location]);

  // Korumalı rotaları kontrol et
  const isProtectedRoute = (path) => {
    const protectedRoutes = ['/dashboard', '/profile', '/userlist', '/addCourse', '/courseList', '/courseUpdate', '/categoryList', '/myCourse'];
    return protectedRoutes.some(route => path.startsWith(route));
  };

  return <>{children}</>;
}

export default AppWrapper;

