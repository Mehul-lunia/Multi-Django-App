import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'


const NavbarComponent = () => {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">MyProject</Navbar.Brand>
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="#home">Speech Translator</Nav.Link>
            <Nav.Link href="#features">E-Commerce Site</Nav.Link>
            <Nav.Link href="#pricing">About Me</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default NavbarComponent