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
    setCreateProject(null);
  } 

  const newProject = () =>{
    setCreateProject(true);
  }
//-----------------
  

  const convertProjectToJSON = (project) => { //projekto vertimas i jsona kad galetume issaugot
    const participantsArray = [];
    
    for(let i = 0; i < project.participantsList.getSize(); i++) //einame per visus projekto darbuotojus
    { 
      const tasksArray = [];
      const participant = project.participantsList.getNode(i);
      
      for (let j = 0; j < participant.data.allTasks.getSize(); j++) //einame per kiekvieno darbutojo uzduotis
      {
        const participantTask = participant.data.allTasks.getNode(j);
        console.log(participantTask);
        tasksArray.push({
          task: participantTask.data.task,
          deadline: participantTask.data.deadline,
          finished: participantTask.data.finished,
        });
      }

      participantsArray.push({
        name: participant.data.nameOfPart.name,
        lastName: participant.data.nameOfPart.lastName,
        jobTitle: participant.data.nameOfPart.jobTitle,
        numOfTasks: tasksArray.length,
        tasks: tasksArray,
      });
    }
    
    return { //returninam jau duomenis kuriuos galim rasyt
        id: project.id,
        name: project.name,
        description: project.description,
        endDate: project.endDate,
        numOfParticip: project.numOfParticip,
        participants: participantsArray,
    };
  };

  const addProject = async (data) =>{ //naudojamas kai kuriamas naudotojo projektas
    let id = data.name.slice(0,4) + data.deadline.slice(5,7) + data.deadline.slice(8,10); //sukuriam id
    
    let participList = new LinkedList(); //darbuotoju sarasas

    data.participants.map((worker) => {
      let allTasks = new DoublyLinkedList();  //uzduociu sarasas
      
      Object.entries(data.tasks).map(([name, tasks]) => { //surenkame uzduotis ir priskiriame atitinkamai prie darbuotoju
        if (worker.name === name)
        {
          tasks.forEach((task) => {
            const newTaskDate = new Date(task.deadline); //terminas
            
            if (allTasks.getSize() === 0)
              allTasks.add(task);
            else {
              let added = false;
              for (let i = 0; i < allTasks.getSize(); i++) //ieskome kur pagal data galima ideti uzduoti
              {
                let taskEx = allTasks.getNode(i);
                const tempDate = new Date(taskEx.data.deadline) 
                if (tempDate >= newTaskDate)
                {
                  allTasks.insertAt(i, task);
                  added = true;
                  break;
                }
              }
              if (!added)
              {
                allTasks.add(task);
              }
            }
          });
        }
      })
      
      
      let participProperties = {//objektas saugantis informacija apie kiekviena darbuotoja ir jo uzduotis
          nameOfPart: {
              name: worker.name,
              lastName: worker.lastName,
              jobTitle: worker.job,
          },
          allTasks: allTasks, //doublylinkedlist
      };

      participList.add(participProperties);//linkedlist
    });

    let project = { //galutinai sudedama i projekta objekta
      description: data.description,
      endDate: data.deadline,
      id: id,
      name: data.name,
      numOfParticip: data.participants.length,
      participants: data.participants,
      participantsList: participList,
    }

    projectsList.add(project); //doublylinkedlist
    setProjects([projectsList.getAllProjects()]);


    //paverciam projekta i jsona
    const projectJSON = convertProjectToJSON(project);

    //issaugom i json faila
    const response = await fetch('http://localhost:5000/update-project-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectJSON }),
    });
  }

  const finishProj = (projId) => //projekto uzbaigimas
  {
    let project;
    let i;
    for (i = 0; i < projectsList.getSize(); i++)
    {
      project = projectsList.getNode(i);
      if (projId === project.data.id)
        break;
    }

    fetch("http://localhost:5000/log-task-update", { //atnaujinamas projekto dokumentas
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          taskName: "",
          status: "projec-finito",
          newDate: "",
          projectName: project.data.name,
          deadline: project.data.endDate,
      }),
    })
    projectsList.removeAt(i);
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