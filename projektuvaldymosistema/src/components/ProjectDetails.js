import React, {useState, useEffect} from "react";
import './ProjectDetails.css';

const ProjectDetails = (props) =>{
    return(
        <div className="alldetails">
            {props.selectedProj == null ? (
                <div className="alldetails">
                    <h1>Pasirinkite projektą</h1>
                </div>
            ) : (
                <div className="alldetails">
                    <h1>{props.selectedProj}</h1>
                </div>
            )}
        </div> 
    );
}

export default ProjectDetails;