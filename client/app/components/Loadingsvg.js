"use client";
import "./Loadingsvg.css"
export default function Loadingsvg(){
const loadingSvg = "/assets/loading.svg"
return(
    <div className="loading-container">
      <img src={loadingSvg} alt="Loading" className="loading-gif" />
    </div>
)
}