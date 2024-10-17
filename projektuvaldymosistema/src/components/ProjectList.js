import React, {useState, useEffect} from "react";
import { DoublyLinkedList } from "../dataStructs/doublyLinkedList";
import './Project.css';
const ProjectList = () => {

    const [projectsList, setProjectsList] = useState(new DoublyLinkedList());
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const newProject = 'temp';
        projectsList.addProject(newProject); //new node created
        setProjects([...projectsList.getAllProjects()]); //add to all projects
    }, []); 

    return(
        <>
            {(() => {
            let current = projectsList.head; // Start from the head of the linked list
            const elements = [];
            while (current) {
                elements.push(
                    <div >
                        <h1>Projekto Pavadinimas</h1>
                        <ul>
                            <li>Dalyviu skaicius: 4</li>
                            <li>Terminas iki: 2024-01-01</li>
                            <button>Aprasas ir dalyviai</button>
                        </ul>
                    </div>
                );
                current = current.next; // Move to the next node
            }
            return elements;
            })()}
        </>
    );
};


export default ProjectList;