import React from "react";
import './ProjectList.css';
 

const ProjectList = (props) => {
    return (  
        <div className="list">
            <div className='Buttons'>
                <div>
                    <button id='newProject' onClick={props.createProj}>Naujas Projektas</button>
                </div>
                <button id='newProject1' onClick={props.workers}>Darbuotojai</button> 
            </div> 
            {(() => { 
                const elements = []; 
                for (let i = 0; i < props.projects.getSize(); i++) //einam per doublylinked lista ir renderinam viska
                {
                    const current = props.projects.getNode(i);
                    const temp = current;
                    elements.push(
                        <div className="projectproperties">
                            <div>
                                <h1>{current.data.name}</h1>
                                <ul>
                                    <li>Dalyvių skaičius: {current.data.numOfParticip}</li>
                                    <li>Terminas iki: {current.data.endDate}</li>
                                </ul> 
                            </div>   
                            <button  
                                className="detailbutton"
                                onClick={() => props.onProjectPress(temp.data.id)}>
                                Detaliau
                            </button>  
                        </div>
                    );  
                }
                return elements;
            })()}
        </div>      
    );
}
 
export default ProjectList;
