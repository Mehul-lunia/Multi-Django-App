import React, { useState, useEffect, useContext } from 'react'
import { ThemeContext } from './App'



const Welcome = () => {


    const theme = useContext(ThemeContext)
    const [profPic, setProfPic] = useState(null)
    const [name, setName] = useState(null)

    useEffect(
        () => {
            console.log("welcome component")

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

    const handleLogoutRequest = () => {
        fetch('/logout').then((res) => {
            if (res.ok) {
                return res.json()
            }
            else {
                return null
            }
        }).then((data) => {
            if (data) {
                document.location.href = "/"
                console.log(data.msg)
            }
        })
    }




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
            <div style={{ "background": `${theme.name === "light" ? "linear-gradient(90deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)" : "linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)"}`, "height": "92.5vh" }} className="d-flex justify-content-around align-items-center">
                <div className="h-50 d-flex justify-content-center align-items-center" style={{ "width": "40%" }}>
                    <img src={profPic} alt="" height="75%" width="50%" />
                </div>
                <div className="h-50 d-flex justify-content-center align-items-center" style={{ "width": "40%" }}>
                    <h1 className='display-2'>Welcome {name}</h1>
                </div>

            </div>



        </>
    )
}

export default Welcome