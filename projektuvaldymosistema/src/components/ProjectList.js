import React, { useState, useEffect } from "react";
import { DoublyLinkedList } from "../dataStructs/doublyLinkedList";
import './ProjectList.css';

const ProjectList = (props) => {

    const [projectsList, setProjectsList] = useState(new DoublyLinkedList());
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (projectsList.length === 0) { // Only add the project if the list is empty
            const newProject = {
                name: 'Kebabine',
                participants: 4,
                endDate: '2024-12-30',
                projectId: 'Keb',
            }; 
            projectsList.addProject(newProject); // Add initial project
            setProjects([...projectsList.getAllProjects()]); // Update state
        }
    }, []);       

    const addNewProject = () => {
        const newProject = {
            name: 'Kebabine',
            participants: 4,
            endDate: '2024-12-30',
            projectId: 'Keb',
        };
        projectsList.addProject(newProject); // Add the new project to the linked list
        setProjects([...projectsList.getAllProjects()]); // Update the state to trigger a re-render
    } 

    const deleteProject = (projectId) =>{
        projectsList.removeProject(projectId);
        setProjects([...projectsList.getAllProjects()]);
    }

    const deleteAllProjects = () => { 
        projectsList.clear();
        setProjects([]); 
    }

    return (
        <div className="list">
            <div className='Projects'>
                <button id='newProject' onClick={addNewProject}>Naujas Projektas</button>
                <button id='newProject1' onClick={deleteAllProjects}>Istrinti Projektus</button>
            </div> 
            {(() => {
                let current = projectsList.head; // Start from the head of the linked list
                const elements = []; 
                while (current != null) {  
                    const temp = current; //storing the project into a variable so that when it is pressed we could return it
                    elements.push(
                        <div className="projectproperties" key={current.data.name}>
                            <div>
                                <h1>{current.data.name}</h1>
                                <ul>
                                    <li>Dalyviu skaicius: {current.data.participants}</li>
                                    <li>Terminas iki: {current.data.endDate}</li>
                                </ul>
                            </div>
                            <button  
                                className="detailbutton"
                                onClick={() => props.onProjectPress(temp.data)}>
                                Detaliau
                            </button>
                            <button 
                                className="detailbutton" 
                                onClick={() => deleteProject(temp.projectId)}> 
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
