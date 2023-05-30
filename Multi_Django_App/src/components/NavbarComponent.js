import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';
import NavbarToggle from 'react-bootstrap/esm/NavbarToggle';


const NavbarComponent = () => {

    const [profPic, setProfPic] = useState(null)
    const [name,setName] = useState(null)

    const func = () => {
        console.log('func')
        fetch('/test')
            .then((res) => { 
                console.log(res.status)
                return res.json()} )
            .then((data) => { 
                setName(data.given_name)
                setProfPic(data.picture) })
    }
    func()
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand><Link to='/app'>MyProject</Link></Navbar.Brand>
            <Container>
                {/* <Nav className="me-auto"> */}
            <Navbar.Text><Link to='/app/speech'>ibm</Link></Navbar.Text>
            <Navbar.Text><Link to='/app/ecomm'>e-commerce store</Link></Navbar.Text>
            <Navbar.Text><Link to='/app/about'>About me</Link></Navbar.Text>
                {/* </Nav> */}
            </Container>
            <Navbar.Collapse className='justify-content-end'>
                <Navbar.Text>{name}</Navbar.Text>
            <Container>
          <Navbar.Brand>
            <img
              src={profPic}
              width="30"
              height="30"
              className=""
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </Container>
        </Navbar.Collapse>
        </Navbar>
    )
}

export default NavbarComponent