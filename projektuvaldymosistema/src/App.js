import './App.css';
import React, { useState } from 'react';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const handleProjectPress = (project) => {
    setSelectedProject(project);  // Update the state with the pressed project
    console.log(selectedProject);
  };
  

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
