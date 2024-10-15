import React from 'react';
import './Project.css';
const Project = () => {
    return(
    <div className='ProjectProp'>
        <h1>Projekto Pavadinimas</h1>
        <ul>
            <li>Dalyviu skaicius: 4</li>
            <li>Terminas iki: 2024-01-01</li>
            <button>Aprasas ir dalyviai</button>
        </ul>
    </div>
    );
};

export default Project;