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
  const [displWorkers, setDisplWorkers] = useState(null);
  const [workers, setWorkers] = useState(new LinkedList());
  
  useEffect(() => {

    for(let i = 0; i < workerData.length; i++)   
      {
        let temp = {
          name: workerData[i].name,
          lastName: workerData[i].lastName,
          job: workerData[i].jobTitle,
          tasks: []
        }
        workers.add(temp); 
      } 

    for(let i = 0; i < projectsJson.length ; i++)
    { 
      projectsJson[i].participantsList = new LinkedList();
      for (let j = 0; j < projectsJson[i].numOfParticip; j++)
      {

        let current = workers.head;
        while(current.data.name !== projectsJson[i].participants[j].name)
        {
          current = current.next;
        }


        let tasks = new DoublyLinkedList();
        for (let y = 0; y < projectsJson[i].participants[j].numOfTasks; y++)
        {
          tasks.addProject(projectsJson[i].participants[j].tasks[y]); 
          current.data.tasks.push(projectsJson[i].participants[j].tasks[y]);

        }
        let participProperties = { 
          allTasks: tasks,
          nameOfPart: projectsJson[i].participants[j],
        }
        projectsJson[i].participantsList.add(participProperties);
      }
      projectsList.addProject(projectsJson[i]);
      console.log(projectsJson[i]);  
    }  
    setProjects([projectsList.getAllProjects()]); // Update state
  }, []);  

  const handleProjectPress = (project) => {
    setSelectedProject(project);  // Update the state with the pressed  project
    setDisplWorkers(null);
  };

          
  
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

  const handleWorkers = () =>{
    setDisplWorkers(true);
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
          workers={handleWorkers}
          />
          <ProjectDetails selectedProj={selectedProject} 
          projects={projectsList} 
          workersDispl={displWorkers} 
          workers={workers}/>  
        </div>  
      </body>
    </div>
  );
}
 
export default App;