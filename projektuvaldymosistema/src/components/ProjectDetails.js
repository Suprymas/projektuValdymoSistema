import React from "react";
import './ProjectDetails.css';

const ProjectDetails = (props) =>{

    let current = props.projects.head;
    if (props.selectedProj !== null)
    {
        while (current.data.id !== props.selectedProj)
        {
            current = current.next;
        } 
    }  

    if (props.workersDispl === true)
    {
        let current = props.workers.head; // Start from the head of the linked list
        const workersList = []; 
        while (current != null) {  
            workersList.push(
                <div className="worker">
                        <h1>{current.data.name} {current.data.lastName}</h1>
                        <button>
                            Paruošti ataskaitą
                        </button>  
                </div>
            );  
            current = current.next; // Move to the next node
        }
        return (
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">Darbuotojai</h1>
                </div> 
                {workersList}
            </div> 
        ); 
    }
    else if (props.selectedProj == null)
    {
        return(
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">Pasirinkite projektą ar darbuotojus</h1> 
                </div>
            </div> 
        ); 
    }
    else {
        return (
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">{current.data.name}</h1>
                    <h1 className="endDate">Terminas iki: {current.data.endDate}</h1>
                </div>
                <div className="descript">
                    {current.data.description}
                </div>
                <div className="descript">
                    {console.log(current.data.participantsList)}
                </div>
            </div>
        );
    }
}

export default ProjectDetails; 