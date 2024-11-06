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
  const [createProject, setCreateProject] = useState(null);
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
    }  
    setProjects([projectsList.getAllProjects()]); // Update state
  }, []);  
 // console.log(projectsList);









  const handleProjectPress = (project) => {
    setSelectedProject(project);  // Update the state with the pressed  project
    setDisplWorkers(null);
    setCreateProject(null);
  };


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

  const newProject = () =>{
    setCreateProject(true);
  }

  const addProject = (data) =>{
    let id = data.name.slice(0,4) + data.deadline.slice(5,7) + data.deadline.slice(8,10);

    //console.log(data);
    let participList = new LinkedList();

    // Iterate over the participants and add them to the linked list
    data.participants.map((worker) => {
        let allTasks = new DoublyLinkedList();  // Doubly Linked List for tasks

        // Add tasks for the current worker into the allTasks doubly linked list
        Object.entries(data.tasks).map(([name, tasks]) => {
          if (worker.name === name)
          {
            tasks.forEach(task => {
              allTasks.addProject(task);  // Add each task individually
          });
          }
        })

        // Create participant node object that holds both worker info and tasks
        let participProperties = {
            nameOfPart: {
                name: worker.name,
                lastName: worker.lastName,
                jobTitle: worker.job,
            },
            allTasks: allTasks,
        };

        // Add the participant with their tasks to the participants list
        participList.add(participProperties);
    });

    let project = {
      description: data.description,
      endDate: data.deadline,
      id: id,
      name: data.name,
      numOfParticip: data.participants.length,
      participants: data.participants,
      participantsList: participList,
    }

    projectsList.addProject(project);
    setProjects([projectsList.getAllProjects()]);

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
          delete={deleteAllProjects} 
          onProjectPress={handleProjectPress}
          deleteProject={deleteProject}
          workers={handleWorkers}
          createProj={newProject}
          />
          <ProjectDetails 
          createProjec={addProject}
          selectedProj={selectedProject} 
          projects={projectsList} 
          workersDispl={displWorkers} 
          workers={workers}
          newProj={createProject}
          />  
        </div>  
      </body>
    </div>
  );
}
 
export default App;