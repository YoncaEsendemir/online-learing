import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Navbar, Nav } from "react-bootstrap"
import { MdLightMode, MdNightlightRound } from "react-icons/md"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/slice/userSlice"
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"
import { IoSchoolOutline } from "react-icons/io5"
import "../css/header.css"

function Header() {
  const [theme, setTheme] = useState("light")
  const loggedInUser = useSelector((state) => state.user.loggedInUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.body.setAttribute("data-theme", newTheme)
  }

  const handleLogout = () => {
    dispatch(logout()) // redux state'ten  kullanıcıyı çıkar
    localStorage.removeItem("user")
    navigate("/login", { replace: true }) // login sayfasına yönlendir
  }

  return (
    <header>
      <Navbar className="headerFooterColor" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <IoSchoolOutline className="me-2" size={30} />
            <span className="brand-text">E-Öğrenme</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/about">
              Hakkımızda
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              İletişim
            </Nav.Link>
          </Nav>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {loggedInUser ? (
                <>
                  <Nav.Link as={Link} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Çıkış Yap</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/register">
                    Kayıt Ol
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    Giriş
                  </Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <Nav.Link onClick={changeTheme}>
                {theme === "light" ? <MdNightlightRound size={25} /> : <MdLightMode size={25} />}
              </Nav.Link>
              <Nav.Link href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={25} />
              </Nav.Link>
              <Nav.Link href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={25} />
              </Nav.Link>
              <Nav.Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={25} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header

