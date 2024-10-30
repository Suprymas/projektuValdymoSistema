import './App.css';
import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import { LinkedList } from './dataStructs/linkedList';
import workerData from './jsonfiles/workers.json';
import { DoublyLinkedList } from './dataStructs/doublyLinkedList';
import projectsJson from "./jsonfiles/projects.json";

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsList, setProjectsList] = useState(new DoublyLinkedList());
  const [projects, setProjects] = useState([]); 
  useEffect(() => {
    for(let i = 0; i < projectsJson.length ; i++)
    { 
      projectsList.addProject(projectsJson[i]);  
      console.log(i);  
    }  
    setProjects([projectsList.getAllProjects()]); // Update state
  }, []);  

  
  const handleProjectPress = (project) => {
    setSelectedProject(project);  // Update the state with the pressed project
  };
  const workers = new LinkedList;
  for(let i = 0; i < workerData.length; i++)  
  {
    workers.add(workerData[i]);
  } 
          
  
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
    <div className="App">
       <body>
        <header className="App-header">
          <div className='ProjectName'>
            <strong>Projektu Valdymo Sistema</strong>
          </div> 
        </header>
        <div className='allProjects'>
          <ProjectList projects={projectsList} 
          addProject={addNewProject} 
          delete={deleteAllProjects} 
          onProjectPress={handleProjectPress}
          deleteProject={deleteProject}
          />
          <ProjectDetails selectedProj={selectedProject} projects={projectsList}/>  
        </div>  
      </body>
    </div>
  );
}

export default App;