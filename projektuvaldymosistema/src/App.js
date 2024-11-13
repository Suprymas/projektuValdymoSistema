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
  const [isInitialized, setIsInitialized] = useState(false);
  const [logOut, setLogOut] = useState(false);
  
  useEffect(() => { //useEffect runs the first time it loads

    if (!isInitialized){  
      for(let i = 0; i < workerData.length; i++)   //issaugomi darbuotojai is json failo i linkedlista
      {
        const temp = {
          name: workerData[i].name,
          lastName: workerData[i].lastName,
          job: workerData[i].jobTitle,
          tasks: []
        }
        workers.add(temp); 
      } 
      
      for(let i = 0; i < projectsJson.length ; i++) //issaugomi projektai i doublylinkedlista
      { 
        projectsJson[i].participantsList = new LinkedList();
        for (let j = 0; j < projectsJson[i].numOfParticip; j++) //nuskaitom kiek darbuotoju
        {

          let node = workers.findNode(worker => worker.name === projectsJson[i].participants[j].name); //surandame tarp darbuotoju linkedlisto darbuotoja ir jam priskiriame darbus

          let tasks = new DoublyLinkedList(); //sukuriame doublylinkedlista
          for (let y = 0; y < projectsJson[i].participants[j].numOfTasks; y++)
          {
            tasks.add(projectsJson[i].participants[j].tasks[y]); //sudedame uzduotis i doublylinkedlista, jie eis i projekta
            node.data.tasks.push(projectsJson[i].participants[j].tasks[y]); //sudedame uzduotis i kita dooublylinkedlista, jie eis i darbuotoju atskira linkedlista

          }
          let participProperties = {      //objekta sukuriame kuri desime i linked lista
            allTasks: tasks,      //uzduotis doublylinkedlist
            nameOfPart: projectsJson[i].participants[j],      //darbuotojo vardas, pavarde, pareigos
          }
          projectsJson[i].participantsList.add(participProperties); //dedame i linkedlista
        }
        projectsList.add(projectsJson[i]); //i projektu doublylinkedlista pridedam node
      }  
      setProjects([projectsList.getAllProjects()]); // Update state
      setIsInitialized(true);
    }
  }, [isInitialized, projectsList]);  


//----------------renderinimui skirta
  const handleProjectPress = (project) => { 
    setSelectedProject(project);  
    setDisplWorkers(null);
    setCreateProject(null);
  };

  const handleWorkers = () =>{
    setDisplWorkers(true);
  } 

  const newProject = () =>{
    setCreateProject(true);
  }
//-----------------
  

  const convertProjectToJSON = (project) => { //projekto vertimas i jsona kad galetume issaugot
    const participantsArray = [];
    let currentParticipant = project.participantsList.head;

    while (currentParticipant !== null) {
        const participant = currentParticipant.data;
        const tasksArray = [];
        let currentTask = participant.allTasks.head;

        while (currentTask !== null) {
            tasksArray.push({
                task: currentTask.data.task,
                deadline: currentTask.data.deadline,
                finished: currentTask.data.finished,
            });
            currentTask = currentTask.next;
        }

        participantsArray.push({
            name: participant.nameOfPart.name,
            lastName: participant.nameOfPart.lastName,
            jobTitle: participant.nameOfPart.jobTitle,
            numOfTasks: tasksArray.length,
            tasks: tasksArray,
        });

        currentParticipant = currentParticipant.next;
    }

    // Convert the entire project into a serializable JSON object
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        endDate: project.endDate,
        numOfParticip: project.numOfParticip,
        participants: participantsArray,
    };
};

  const addProject = async (data) =>{
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
            tasks.forEach((task) => {
              const newTaskDate = new Date(task.deadline);

              // Find the correct index to insert the task based on the deadline
              let currentIndex = allTasks.head;
              let index = 0;

              while (currentIndex && new Date(currentIndex.data.deadline) <= newTaskDate) {
                currentIndex = currentIndex.next;
                index++;
              }

              // Insert the task at the correct position
              allTasks.insertAt(index, task);
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

    projectsList.add(project);
    setProjects([projectsList.getAllProjects()]);






try {
  // Convert the project to a JSON-friendly format
  const projectJSON = convertProjectToJSON(project);

  // Send the serialized project to the backend
  const response = await fetch('http://localhost:5000/update-project-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: projectJSON }),
  });

  if (!response.ok) {
      throw new Error(`Error saving project: ${response.statusText}`);
  }

  const result = await response.json();
  console.log("Project saved successfully:", result);
  } catch (error) {
    console.error("Error calling API to save project:", error);
  }





  }

  const finishProj = (projId) =>
  {

    let current = projectsList.head;
    let index = 0;
    while(current.data.id !== projId)
    {
      current = current.next;
      index++;
    }

    fetch("http://localhost:5000/log-task-update", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          taskName: "",
          status: "projec-finito",
          newDate: "",
          projectName: current.data.name,
          deadline: current.data.endDate,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Task update logged:", data.message);
    })
    .catch((error) => {
        console.error("Error logging task update:", error);
    });
    projectsList.removeAt(index);
    setSelectedProject(null);
  }

  return ( 
    <div className="App">
       <body>
       {!logOut ?
        (
          <div>
            <header className="App-header">
              <div className='ProjectName'>
                <strong>Projektų Valdymo Sistema</strong>
              </div> 
              <div className='log-out'>
                <button onClick={() => {
                  setLogOut(true);
                }}>Atsijungti</button>
              </div>
            </header>
            <div className='allProjects'>
              <ProjectList projects={projectsList} 
              onProjectPress={handleProjectPress}
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
              finish={finishProj}
              />  
            </div>
          </div>  
        ) 
        :
        ( <div className='exit'>
            <strong>Viso gero!</strong>
          </div>
        )
        }
      </body>
    </div>
  );
}
 
export default App;