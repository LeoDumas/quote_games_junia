import {useState} from "react"
import "./Button.css"

function Button({h,w,Answer,txt,link = ""}){
    const [hovered,setHovered] = useState(false);
    const [answer, isAnswer] = useState(false);
    
    return(
        <button
        className ="btn" 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style = {{
            height: h,
            width : w,
            fontSize: h*0.8,
            lineHeight : '${h}px'
        }}>
        {txt}</button>
    );

}

