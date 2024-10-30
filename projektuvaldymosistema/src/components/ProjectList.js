import React from "react";
import './ProjectList.css';
 

const ProjectList = (props) => {
    return (  
        <div className="list">
            <div className='Projects'>
                <button id='newProject' onClick={props.addNewProject}>Naujas Projektas</button>
                <button id='newProject1' onClick={props.delete}>Istrinti Projektus</button>
            </div> 
            {(() => {
                let current = props.projects.head; // Start from the head of the linked list
                const elements = []; 
                while (current != null) {  
                    const temp = current; //storing the project into a variable so that when it is pressed we could return it
                    elements.push(
                        <div className="projectproperties">
                            <div>
                                <h1>{current.data.name}</h1>
                                <ul>
                                    <li>Dalyviu skaicius: {current.data.numOfParticip}</li>
                                    <li>Terminas iki: {current.data.endDate}</li>
                                </ul> 
                            </div>   
                            <button  
                                className="detailbutton"
                                onClick={() => props.onProjectPress(temp.data.id)}>
                                Detaliau
                            </button>  
                            <button 
                                className="deletebutton" 
                                onClick={() => props.deleteProject(temp.data.id)}>  
                                Užbaigti projektą
                            </button> 
                        </div>
                    );  
                    current = current.next; // Move to the next node
                }
                return elements;
            })()}
        </div>      
    );
}
 
export default ProjectList;
