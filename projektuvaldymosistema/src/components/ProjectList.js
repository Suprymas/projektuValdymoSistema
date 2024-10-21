import React, {useState, useEffect} from "react";
import { DoublyLinkedList } from "../dataStructs/doublyLinkedList";
import './ProjectList.css';

const ProjectList = (props) => {

    const [projectsList, setProjectsList] = useState(new DoublyLinkedList());
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (projectsList.length === 0) { // Only add the project if the list is empty
            const newProject = 'temp';
            projectsList.addProject(newProject); // Add initial project
            setProjects([...projectsList.getAllProjects()]); // Update state
        }  
    }, []);      
    
    const addNewProject = () =>
    {
        const newProject = {
            name: 'Kebabine',
            participants: 4,
            endDate: '2024-12-30',
        }; // You can change the project name here
        projectsList.addProject(newProject); // Add the new project to the linked list
        setProjects([...projectsList.getAllProjects()]); // Update the state to trigger a re-render
    }
    function deleteAllProjects() {  
        projectsList.clear();
        setProjects([]); 
    }

    function log (object)
    {
        console.log(object);
    }

    return(
        <div className="list">
            <div className='Projects'>
                <button id='newProject' onClick={addNewProject}>Naujas Projektas</button>
                <button id='newProject1' onClick={deleteAllProjects}>Istrinti Projektus</button>
            </div>
            {(() => {
            let current = projectsList.head; // Start from the head of the linked list
            const elements = [];
            while (current) {
                elements.push(
                    <div className="projectproperties">
                        <div>
                            <h1>{current.data.name}</h1>
                            <ul>
                                <li>Dalyviu skaicius: {current.data.participants}</li>
                                <li>Terminas iki: {current.data.endDate}</li>
                            </ul>
                        </div>
                        <button className="detailbutton" onClick={() => props.onProjectPress(current.data)}>Detaliau</button>
                    </div>
                );
                current = current.next; // Move to the next node 
            }
            return elements;
            })()}
        </div>
    );
};



export default ProjectList;