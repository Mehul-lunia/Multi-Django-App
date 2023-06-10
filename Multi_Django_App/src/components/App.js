import React from 'react'
import { createRoot } from 'react-dom';
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import SpeechTranslator from './SpeechTranslator';
import Welcome from './Welcome';
import Ecomm from './Ecomm';
import About from './About'




const App = () => {
  

   

    
    return (
        <>
            <Router>
                <NavbarComponent />
            
            <Routes>
                <Route path="app" element={<Welcome />}/>
                <Route path="app/speech" element={<SpeechTranslator />} />
                <Route path="app/ecomm" element={<Ecomm />} />
                <Route path="app/about" element={<About />} />
            </Routes>
            </Router>
 
       
        </>
    )
}

export default App

const container = document.getElementById('app');
const root = createRoot(container); 
root.render(<App />);