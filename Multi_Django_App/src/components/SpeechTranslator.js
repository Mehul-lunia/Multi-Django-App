import React, { useState, useEffect ,useRef } from 'react'







const SpeechTranslator = () => {
    
    const [chunks, setChunks] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioReady,setAudioReady] = useState(false)
    const [audioSrc,setAudioSrc] = useState(null);
    const [targetLang,setTargetLang] = useState('')
    const inputRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.addEventListener('dataavailable', (e) => {
            setChunks([...chunks, e.data])
        })
        recorder.addEventListener('stop', (e) => {
            console.log("The recording has stopped!")
        })
    }, [])

    // Start recording voice
    const startRecording = () => {
        mediaRecorder.start()
    }

    //Stop recording the voice by calling the .stop() function
    const stopRecording = () => {
        mediaRecorder.stop()
       

    }

    const createAudioFile = async () => {
        console.log(chunks);
        const blob = new Blob(chunks, { type: "audio/wav" })
        //sending the blob file in post request by making it into formdata
        const fd = new FormData()
        fd.append('recording', blob)
        fd.append('target_language',targetLang)
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
                const byteCharacters = atob(data.msg)
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {type: "audio/wav"})
                const audioUrl = URL.createObjectURL(blob)
                setAudioSrc(audioUrl)
                setAudioReady(true)
                console.log(blob)
             })

    }

    //Cookies are required to send post requests to django backends, this function gets the cookies
    function getCookie(name) {
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? cookieValue.pop() : '';
    }


    const HandleTargetLanguage = ()=>{
        const lang = inputRef.current.value
        setTargetLang(lang)
    }

    return (
        <>
        
            <button onClick={startRecording}>start</button>
            <button onClick={stopRecording}>stop</button>
            <button onClick={createAudioFile}  ref={btnRef}>Play Audio</button>
            <h3>Target Language</h3>
            <div>
                <input type="text"  placeholder='Enter the target language here' ref={inputRef} list='languageList'/>
                <datalist id='languageList'>
                <option value="French"/>
                <option value="German"/>
                <option value="Spanish"/>
                <option value="Brazilian portugese"/>
                <option value="Dutch"/>
                <option value="Japanese"/>
                <option value="Italian"/>
                </datalist>
            </div>
            <button onClick={HandleTargetLanguage}>Ok</button>
            {audioReady?<audio controls>
                <source src={audioSrc} type='audio/wav'/>
                <input type="file" name="fileInputer" id="" />
            </audio>:null}
        </>
    )
}

export default SpeechTranslator