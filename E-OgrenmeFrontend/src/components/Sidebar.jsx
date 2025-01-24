import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBook, FaPlus } from 'react-icons/fa';
import { useSelector,useDispatch } from 'react-redux';
import {setUser} from '../redux/slice/userSlice'
import { PiUserListFill } from "react-icons/pi";
import '../css/Sidebar.css';


function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const {loggedInUser} = useSelector((state)=>state.user);
const dispatch=useDispatch();
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(()=>{
       const storeUser=JSON.parse(localStorage.getItem('user'));
       // storeUserdolu ve loggedInUser boş ise if girer
       if(storeUser && !loggedInUser ){
          dispatch(setUser(storeUser));
       }

  })

  const isAdmin = loggedInUser?.role === 1;
 
  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'}
      </div>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/dashboard">
          <FaHome className="nav-icon" />
          <span className="nav-text">Dashboard</span>
        </Nav.Link>
        {!isAdmin &&(
        <Nav.Link as={Link} to="/myCourse">
        <FaHome className="nav-icon" />
        <span className="nav-text">Eğitimlerim</span>
      </Nav.Link>
        )}
        <Nav.Link as={Link} to="/profile">
          <FaUser className="nav-icon" />
          <span className="nav-text">Profile</span>
        </Nav.Link>
        { isAdmin &&(
        <>
        <Nav.Link as={Link} to="/courseList">
          <FaBook className="nav-icon" />
          <span className="nav-text">Kurslar</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/addCourse">
          <FaPlus className="nav-icon" />
          <span className="nav-text">Kurs Ekle</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/categoryList">
          <FaBook className="nav-icon" />
          <span className="nav-text">Kategori Ekle</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/userlist">
          <PiUserListFill className="nav-icon" />
          <span className="nav-text">Kullanıcı Listesi</span>
        </Nav.Link>
        </>
      )}
      </Nav>
    </div>
  );
}

export default Sidebar;

