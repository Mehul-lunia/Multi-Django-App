import React, { useState } from 'react'
import { render } from 'react-dom'
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router,Routes,Route,Link } from 'react-router-dom';
import SpeechTranslator from './SpeechTranslator';
import Welcome from './Welcome';
import Ecomm from './Ecomm';
import About from './About'
import TranslationScreen from './TranslationScreen';


const App = () => {
    const [ mode,setMode ]= useState("dark")

    return (
        <>

            <Router>
                <NavbarComponent />
                
                
                
            <Routes>
                <Route exact path="/app" element={<Welcome />}/>
                <Route path="app/speech" element={<SpeechTranslator />} />
                <Route path="app/ecomm" element={<Ecomm />} />
                <Route path="app/about" element={<About />} />
                
            </Routes>
            </Router>
        </>
    )
}

export default App

const appDiv = document.getElementById('app');
render(<App />, appDiv)