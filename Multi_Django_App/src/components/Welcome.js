import React,{useState,useEffect} from 'react'

const Welcome = () => {
  const [url,seturl] = useState(null);
  
  useEffect(
    ()=>{
      fetch('https://api.unsplash.com/photos/?client_id=VEUwCIaZFr3oMmBhsAcmvp28KieQtffsx0b4BUJdTu8')
      .then(res => res.json())
      .then((data)=>{
        let randNo = Math.floor(Math.random()*10)
        seturl(data[randNo].urls.raw)
        console.log(randNo)
      })
    },[0])
  return (

      <img src={url} alt="" style={{"height":`${90.2}vh`,"width":`${100}vw`}} /> 
   
  )
}

export default Welcome