import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';



const NavbarComponent = () => {

    const [profPic, setProfPic] = useState(null)
    const [name,setName] = useState(null)
    
    useEffect(
        () => {
            fetch('/test')
                .then((res) => { 
                    if(res.ok){
                        return res.json()
                    }
                    else{
                        return "no"
                    }
                    } )
                .then((data) => { 
                    if(data !="no"){
                        setName(data.given_name);
                        setProfPic(data.picture);
                    }
        })
        

        }
      
        ,[])

    
    
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="app" className='text-light text-decoration-none'>MyProject</Navbar.Brand>
            <Container>
              
                <Navbar.Collapse>
            <Navbar.Text as={Link} to='app/speech' className='text-light text-decoration-none'>Audio Translator</Navbar.Text>
                </Navbar.Collapse>
                <Navbar.Collapse>
            <Navbar.Text as={Link} to="/app/ecomm" className="text-light text-decoration-none">E-commerce Store</Navbar.Text>
                </Navbar.Collapse>
                <Navbar.Collapse>
            <Navbar.Text as={Link} to="app/about" className="text-light text-decoration-none">About me</Navbar.Text>
                </Navbar.Collapse>
             
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
              alt={name}
            />
          </Navbar.Brand>
        </Container>
        </Navbar.Collapse>
        </Navbar>
    )
}

export default NavbarComponent