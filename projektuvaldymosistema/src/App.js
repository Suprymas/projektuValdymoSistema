import './App.css';
import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';

function App() {
  

  return (
    <div className="App">
       <body>
        <header className="App-header">
          <div className='ProjectName'>
            <strong>Projektu Valdymo Sistema</strong>
          </div>
        </header>
        <div className='Projects'>
          <button id='newProject'>Naujas Projektas</button>
          <button id='newProject1'>Istrinti Projektus</button>
        </div>
        <div className='allProjects'>
          <ProjectList/>
        </div>
      </body>
    </div>
  );
}

export default App;
