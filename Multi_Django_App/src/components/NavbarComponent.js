import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { ThemeContext } from './App';





const NavbarComponent = (props) => {

  const theme = useContext(ThemeContext)
  const [profPic, setProfPic] = useState(null)
  const [name, setName] = useState(null)

  useEffect(
    () => {
      console.log("navbar component")

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








    }

    , [])

  const changeTheme = () => {
    theme.updateTheme(theme.name === "light" ? "dark" : "light")
  }


  const handleProfPicClick = ()=>{
    theme.updateShowPopover(!theme.showPopover);
   
  }

  






  return (
    <>


    <nav class={`navbar navbar-expand-lg bg-body-tertiary bg-${theme.name}`} data-bs-theme={`${theme.name}`}>
      <div class={`container-fluid text-${theme.name === "light" ? "dark" : "light"}`}>
        <Link class={`navbar-brand text-${theme.name === "light" ? "dark" : "light"}`} to="app"  onClick={()=>{theme.updateShowPopover(false)}}>Multi-Django-App</Link>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <Link class={`nav-link active text-${theme.name === "light" ? "dark" : "light"}`} aria-current="page" to="app/speech" onClick={()=>{theme.updateShowPopover(false)}}>Audio Translator</Link>
            </li>
            <li class="nav-item">
              <Link class={`nav-link active text-${theme.name === "light" ? "dark" : "light"}`} text-light to="app/ecomm"  onClick={()=>{theme.updateShowPopover(false)}}>E-commerce Store</Link>
            </li>

            <li class="nav-item">
              <Link class={`nav-link active text-${theme.name === "light" ? "dark" : "light"}`} to="app/about"  onClick={()=>{theme.updateShowPopover(false)}}>About</Link>
            </li>
          </ul>
          <div onClick={changeTheme}>
            {
              theme.name === "light" ?
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16">
                  <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg>
            }
          </div>
          <div className={`text-${theme.name === "light" ? "dark" : "light"} ms-4`}>
            {name}
          </div>
          <div className="ms-2" onClick={handleProfPicClick}>
            
             <img src={profPic} alt="profilePicture" width={30} height={30} />
            
          </div>
        </div>
      </div>
    </nav>
  
    </>

  )
}

export default NavbarComponent