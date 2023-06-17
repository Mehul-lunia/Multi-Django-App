import React,{useContext} from 'react'
import { ThemeContext } from './App'

const About = () => {
  const theme = useContext(ThemeContext);

  return (
    <>
            {/* the below code is to display the popover if selected is true */}

            {theme.showPopover && <div style={{ "position": "fixed", "zIndex": "9", "width": "100%", "height": "350px" }} className="d-flex justify-content-end mt-1">
                <div className={`h-100  me-2 rounded text-${theme.name === "light" ? "dark" : "light"}`} style={{ "backgroundColor": `${theme.name === "light" ? "white" : "#1A202C"}`, "width": "20vw" }}>
                    <div className="d-flex justify-content-around align-items-center">
                        <img src={theme.profPic} alt="" height={75} width={75} />
                        <strong style={{ "fontFamily": "system-ui", "fontSize": "30px" }}>{theme.username}</strong>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button className="btn btn-danger" onClick={handleLogoutRequest}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg> Logout</button>
                    </div>
                </div>
            </div>}
    <h1>About</h1>
    </>
  )
}

export default About