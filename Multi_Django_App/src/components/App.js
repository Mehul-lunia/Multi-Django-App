import React,{createContext,useState,useEffect} from 'react'
import { createRoot } from 'react-dom';
import NavbarComponent from './NavbarComponent';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import SpeechTranslator from './SpeechTranslator';
import Welcome from './Welcome';
import Ecomm from './Ecomm';
import About from './About'




export const ThemeContext = createContext()
const App = () => {
    
    const [name,setName] = useState("");
    const [profPic,setProfPic] = useState('');
    const [theme,setTheme] = useState('light');
    const [showPopover,setShowPopover] = useState(false);



    const updateTheme = (item)=>{
        setTheme(item)
    }

    const updateShowPopover = (bool)=>{
        setShowPopover(bool)
    }

    useEffect(()=>{
        
        fetch('/test')
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          else {
            fetch('/get-user-details')
              .then((res) => {

                return res.json()

              })
              .then((data) => {
                console.log('im inside')

                const byteCharacters = atob(data.msg)
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "image/png" })
                const image = URL.createObjectURL(blob)
                console.log(image)
                setProfPic(image)
                setName(data.username)
                return null

              })
          }
        })
        .then((data) => {
          if (data) {
            console.log("lol")
            setName(data.given_name);
            setProfPic(data.picture);
          }
        })


    },[])

    
    return (
        <>
        <ThemeContext.Provider value={
            {
            "name":theme,"updateTheme":updateTheme,
            "showPopover":showPopover,"updateShowPopover":updateShowPopover,
            "profPic":profPic,"username":name}
            }>
            <Router>
                <NavbarComponent />
            
            <Routes>
                <Route path="app" element={<Welcome />}/>
                <Route path="app/speech" element={<SpeechTranslator />} />
                <Route path="app/ecomm" element={<Ecomm />} />
                <Route path="app/about" element={<About />} />
            </Routes>
            </Router>
        </ThemeContext.Provider>
 
       
        </>
    )
}

export default App

const container = document.getElementById('app');
const root = createRoot(container); 
root.render(<App />);