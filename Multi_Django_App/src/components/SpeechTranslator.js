import React, { useState, useEffect, useContext } from 'react'
import Button from "react-bootstrap/Button"
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
// import Spinner from 'react-bootstrap/esm/Spinner';
import Spinner from 'react-bootstrap/Spinner';
import { ThemeContext } from './App';









const SpeechTranslator = () => {

    const theme = useContext(ThemeContext)

    const [chunks, setChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioReady, setAudioReady] = useState(false)
    const [audioSrc, setAudioSrc] = useState(null);
    const [targetLang, setTargetLang] = useState('');
    const [isSelected, setIsSelected] = useState('');
    const [pastAudioDict, setPastAudioDict] = useState({})
    const [dictReady, setDictReady] = useState(false)
    const [loading, setLoading] = useState(false);
    const [textEn, setTextEn] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [file, setFile] = useState(null);
    const [isTargetLanguageSelected, SetTargetLanguageIsSelected] = useState(false);
    const [disableCreateAudioBtn, setDisableCreateAudioBtn] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState([])
    const [audioUrl, setAudioUrl] = useState(null);
    const [data, setData] = useState(null);


    useEffect(() => {
        async function getStream() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            recorder.addEventListener('dataavailable', (e) => {
                setChunks([...chunks, e.data])
            })
            recorder.addEventListener('stop', () => {
                console.log("The recording has stopped!")
            })
        }
        getStream()

        fetch('/ibm/historical-translations').then(res => res.json()).then((data) => {
            console.log(data);
            setPastAudioDict(data);
            setDictReady(true)
        })



    }, [])


    const flags = {
        "german": { "codeName": "de", "color": "linear-gradient(90deg, rgba(35,35,34,1) 42%, rgba(225,49,88,1) 55%, rgba(210,208,18,1) 68%)" },
        "french": { "codeName": "fr", "color": "linear-gradient(90deg, rgba(40,29,253,1) 38%, rgba(244,237,241,1) 52%, rgba(225,49,88,1) 63%)" },
        "italian": { "codeName": "it", "color": "linear-gradient(90deg, rgba(80,145,17,1) 43%, rgba(241,241,235,1) 54%, rgba(244,2,2,1) 67%)" },
        "spanish": { "codeName": "es", "color": "linear-gradient(90deg, rgba(195,0,0,1) 16%, rgba(255,243,0,1) 54%, rgba(195,0,0,1) 90%)" },
        "brazilian_portugese": { "codeName": "br", "color": "linear-gradient(90deg, rgba(80,145,17,1) 48%, rgba(250,225,28,1) 89%)" },
        "dutch": { "codeName": "nl", "color": "linear-gradient(90deg, rgba(178,3,3,1) 28%, rgba(255,255,255,1) 54%, rgba(12,22,109,1) 75%" },
        "japanese": { "codeName": "jp", "color": "radial-gradient(circle, rgba(225,49,88,1) 39%, rgba(244,244,238,1) 39%, rgba(240,240,234,1) 45%)" }
    }



    // Start recording voice
    const startRecording = () => {
        setAudioSrc(null);
        setAudioReady(false);
        setTextEn('');
        setTranslatedText('');
        setDisableCreateAudioBtn(true);
        mediaRecorder.start()
    }

    //Stop recording the voice by calling the .stop() function
    const stopRecording = () => {
        mediaRecorder.stop();
        setDisableCreateAudioBtn(false);


    }



    //Cookies are required to send post requests to django backends, this function gets the cookies
    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }

    const createAudioFile = async () => {
        setLoading(true);
        console.log(chunks);
        const blob = new Blob(chunks, { type: "audio/wav" })
        setAudioUrl(blob)
        //sending the blob file in post request by making it into formdata
        const fd = new FormData()
        fd.append('recording', blob)
        fd.append('target_language', targetLang)
        // POST request to endpoint '/ibm/execute'
        const postOptions = {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: fd

        }
        fetch('/ibm/execute', postOptions)
            .then((res) => res.json())
            .then((data) => {
                setTextEn(data.eng_text);
                setTranslatedText(data.translated_text)
                const byteCharacters = atob(data.msg)
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "audio/wav" })
                const audioUrl = URL.createObjectURL(blob)
                setAudioSrc(audioUrl)
                setAudioReady(true)
                setLoading(false);
                console.log(blob)
            })

    }



    const handleMedium = () => {
        return (
            <>
                <div className="text-center text-dark">
                    <h2>Choose a medium to translate audio</h2>
                </div>
                <div style={{ "display": "grid", "gridTemplateColumns": "auto", "justifyItems": "center", "gridTemplateRows": "75px 75px 75px", "marginTop": "15px" }} className='text-dark'>

                    <h4>Record Your Audio - <Button onClick={() => { setIsSelected("record") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-mic" viewBox="0 0 16 16">
                        <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z" />
                        <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z" />
                    </svg></Button></h4>

                    <h4 className='text-dark'>or</h4>


                    <h4 className="text-dark">Choose a Audio file from your computer  - <Button onClick={() => { setIsSelected("file") }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                    </svg></Button></h4>

                </div>
            </>

        )
    }



    const alertFunction = (alertText, level) => {
        setTimeout(() => {
            setShowAlert(false)
        }, 5000)

        return (
            <div className={`alert alert-${level} `} role="alert">
                <strong>{alertText}</strong>
            </div>

        )
    }


    const handleFileChange = (event) => {
        const fileExtensionRegex = /\.wav$/i;
        const fileName = event.target.value
        if (fileExtensionRegex.test(fileName)) {
            setFile(event.target.files[0])
        }
        else {
            setShowAlert(true)
            setAlertDetails((prevVal) => [...prevVal, "incorrect file format", "warning"])


        }

    }



    const handleFileSubmission = () => {
        const fd = new FormData()
        fd.append('recording', file)
        fd.append('target_language', targetLang)
        // POST request to endpoint '/ibm/execute'
        const postOptions = {
            method: "POST",
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: fd

        }
        fetch('/ibm/execute', postOptions)
            .then((res) => res.json())
            .then((data) => {
                setTextEn(data.eng_text);
                setTranslatedText(data.translated_text)
                const byteCharacters = atob(data.msg)
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "audio/wav" })
                const audioUrl = URL.createObjectURL(blob)
                setAudioSrc(audioUrl)
                setAudioReady(true)
                setLoading(false);
                console.log(blob)
            })

    }



    const handleTargetLanguageBtnClick = (e) => {
        console.log(e.target.id)
        setTargetLang(e.target.id);
        SetTargetLanguageIsSelected(true);
    }

    const handleNewClick = () => {
        const fd = new FormData()
        fd.append("audio_url", audioUrl)
        const postOptions = {
            method: "POST",
            headers:
            {
                "X-CSRFToken": getCookie('csrftoken')
            },
            body: fd
        };
        fetch('/ibm/abc', postOptions)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                // setData(data.msg)
                console.log(data.msg)
                
            });

        





    }


    const showChosenComponent = (component) => {
        if (component == "record") {
            return (
                <>
                    <div style={{ "display": "flex", "flexDirection": "column" }}>
                        {isTargetLanguageSelected && <div style={{ "height": "15rem", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <Button onClick={startRecording} style={{ "marginRight": "5px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-record2" viewBox="0 0 16 16">
                                <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10z" />
                                <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                            </svg></Button>
                            <Button onClick={stopRecording} style={{ "marginRight": "5px" }}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stop-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3z" />
                            </svg></Button>
                            <Button onClick={createAudioFile} style={{ "marginRight": "5px" }} disabled={disableCreateAudioBtn}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-play" viewBox="0 0 16 16">
                                <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
                            </svg></Button>
                            <button onClick={handleNewClick}>new</button>
                        </div>
                        }
                        <div style={{ "display": "flex", "justifyContent": "center" }}>
                            <Dropdown as={ButtonGroup}>
                                <Button variant="success">{isTargetLanguageSelected ? `${targetLang.toString()}` : 'Select Target Language'}</Button>

                                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                                <Dropdown.Menu>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id='french'><span className='fi fi-fr fis' ></span> French</Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="german"><span className="fi fi-de fis" ></span> German</Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="spanish"><span className='fi fi-es fis' ></span> Spanish </Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="japanese"><span className='fi fi-jp fis'></span> Japanese</Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="brazilian_portugese"><span className='fi fi-br fis'  ></span> Brazilian Portugese</Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="italian"><span className='fi fi-it fis' ></span> Italian</Dropdown.Item>
                                    </div>
                                    <div onClick={handleTargetLanguageBtnClick}>
                                        <Dropdown.Item as="button" id="dutch"><span className='fi fi-nl fis' ></span> Dutch</Dropdown.Item>
                                    </div>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>


                </>
            )
        }
        else {
            return (
                <>
                    <input type="file" id="newFile" onChange={handleFileChange} />
                    <Dropdown as={ButtonGroup}>
                        <Button variant="success">Select Target Language</Button>

                        <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                        <Dropdown.Menu>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("french") }}><span className='fi fi-fr fis'></span> French</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("german") }}><span className="fi fi-de fis"></span> German</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("spanish") }}><span className='fi fi-es fis'></span> Spanish </Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("japanese") }}><span className='fi fi-jp fis'></span> Japanese</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("brazilian_portugese") }}><span className='fi fi-br fis'></span> Brazilian Portugese</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("italian") }}><span className='fi fi-it fis'></span> Italian</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setTargetLang("dutch") }}><span className='fi fi-nl fis'></span> Dutch</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <button className="btn btn-primary" onClick={handleFileSubmission}>Ok</button>
                </>

            )
        }
    }



    const handlePlayPreviousEnglishAudioClick = (audioElement) => {

        const byteCharacters = atob(audioElement.eng_b64)
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(blob)

        const audio = new Audio(audioUrl);
        audio.play()

    }
    const handlePlayPreviousTranslatedAudioClick = (audioElement) => {

        const byteCharacters = atob(audioElement.translated_b64)
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(blob)


        const audio = new Audio(audioUrl);
        audio.play()

    }


    const previousRecordings = (audioElement) => {
        return (
            <Card className='mt-5'>
                <Card.Header className='d-flex justify-content-between' style={{ "backgroundImage": `${flags[audioElement.target_language.toString()]['color']}` }}>
                    {audioElement.created_at}
                    <span className={`fi fi-${flags[audioElement.target_language.toString()]["codeName"]} `} ></span></Card.Header>
                <Card.Body style={{ "backgroundColor": `${theme.name === "light" ? "#222831" : "#DDDDDD"}` }}>
                    <Card.Title className={`text-${theme.name === "light" ? "light" : "dark"}`}>You translated to {audioElement.target_language.toString()} language</Card.Title>
                    <Card.Text className={`text-${theme.name === "light" ? "light" : "dark"}`}>
                        <b>English Input</b> : {(audioElement.english_input.toString())}
                    </Card.Text>
                    <Button variant="primary" onClick={() => { handlePlayPreviousEnglishAudioClick(audioElement) }} className="me-3">Input audio</Button>
                    <Button variant="primary" onClick={() => { handlePlayPreviousTranslatedAudioClick(audioElement) }}>Output audio</Button>
                </Card.Body>
            </Card>
        );
    }

    function handleLogoutRequest() {
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
            <div style={{ "backgroundColor": `${theme.name === "light" ? "#DDDDDD" : "#222831"}`, "height": "cover" }}>
                {showAlert && alertFunction(alertDetails[0], alertDetails[1])}

                <div style={{ "height": "50vh", "display": "flex", "justify-content": "center" }}>

                    <div style={{ "width": "50vw", "height": "100%", "backgroundColor": `${theme.name === "light" ? "#222831" : "#DDDDDD"}`, "margin": "10px", "borderRadius": "25px", "color": "white" }}>

                        {isSelected === "" ? handleMedium() : showChosenComponent(isSelected)}

                    </div>




                    <div style={{ "width": "50vw", "height": "100%", "backgroundColor": `${theme.name === "light" ? "#222831" : "#DDDDDD"}`, "margin": "10px", "borderRadius": "25px", "color": "white" }}>

                        {loading && <div style={{ "display": "flex", "height": "100%", "justifyContent": "center", "alignItems": "center" }}>
                            <Spinner />
                        </div>}

                        {!loading && <div>

                            <div className='h-25 bg-secondary'>
                                <p>{textEn}</p>
                            </div>
                            <div className='h-25 bg-secondary'>
                                <p>{translatedText}</p>
                            </div>

                            <div style={{ "display": "flex", "height": "100%", "justifyContent": "center", "alignItems": "center" }}>
                                {audioReady ? <audio controls>
                                    <source src={audioSrc} type='audio/wav' />
                                    <input type="file" name="fileInputer" id="" />
                                </audio> : null}
                            </div>

                        </div>
                        }


                    </div>

                </div>


                <div className='d-flex justify-content-center'>
                    <h2 className={`text-${theme.name === "light" ? "dark" : "light"} my-5`}>History</h2>
                </div>
                <div className='container'>
                    {dictReady && Object.keys(pastAudioDict).map((keyname) => {
                        return previousRecordings(pastAudioDict[keyname])

                    })}
                </div>


            </div>
        </>
    )
}

export default SpeechTranslator
