import './App.css';
import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import { LinkedList } from './dataStructs/linkedList';
import workerData from './jsonfiles/workers.json';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleProjectPress = (project) => {
    setSelectedProject(project);  // Update the state with the pressed project
    console.log(selectedProject);
  };
  const workers = new LinkedList;
  for(let i = 0; i < workerData.length; i++)
  {
    workers.add(workerData[i]);
  }
  
  console.log(workers); 

  return (
    <div className="App">
       <body>
        <header className="App-header">
          <div className='ProjectName'>
            <strong>Projektu Valdymo Sistema</strong>
          </div>
        </header>
        <div className='allProjects'>
          <ProjectList onProjectPress={handleProjectPress}/>
          <ProjectDetails />
        </div>
      </body>
    </div>
  );
}

export default App;
