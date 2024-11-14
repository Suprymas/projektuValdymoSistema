import React, {useState} from "react";
import './ProjectDetails.css';
import workerData from '../jsonfiles/workers.json';

const ProjectDetails = (props) =>{
    const [renderTrigger, setRenderTrigger] = useState(false);
    const [choosenWorker, setChoosenWorker] = useState([]);
    const [taskFields, setTaskFields] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [projectDeadline, setProjectDeadline] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [newTask, setNewTask] = useState('');
    const [newDate, setNewDate] = useState('')
    const [changeDate, setChangeDate] = useState('')



    let current;
    if (props.selectedProj !== null)
    {
        for (let i = 0; i < props.projects.getSize(); i++)
        {
            current = props.projects.getNode(i);
            if (current.data.id === props.selectedProj)
                break;
        }
    }  


    const updateProjectFile = () => { //atnaujinti projekto json faila
        const updatedProject = {
            id: current.data.id,
            name: current.data.name,
            description: current.data.description,
            endDate: current.data.endDate,
            numOfParticip: current.data.numOfParticip,
            participants: [],
        }; 
        
        for(let i = 0; i < current.data.participantsList.getSize(); i++) //einame per visus projekto darbuotojus
        { 
            const tasksArray = [];
            const participant = current.data.participantsList.getNode(i);
            
            for (let j = 0; j < participant.data.allTasks.getSize(); j++) //einame per kiekvieno darbutojo uzduotis
            {
                const participantTask = participant.data.allTasks.getNode(j);
                tasksArray.push({
                    task: participantTask.data.task,
                    deadline: participantTask.data.deadline,
                    finished: participantTask.data.finished,
                });
            }

            updatedProject.participants.push({
                name: participant.data.nameOfPart.name,
                lastName: participant.data.nameOfPart.lastName,
                jobTitle: participant.data.nameOfPart.jobTitle,
                numOfTasks: tasksArray.length,
                tasks: tasksArray,
            });
        }


        
        fetch("http://localhost:5000/update-project-json", { //updatiname json
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project: updatedProject }),
        })
    };





    const triggerReRender = () => {
        setRenderTrigger(!renderTrigger);
    };

    const addWorker = (worker) => { //pasirinkti darbuotojai kuriant nauja projekta kol kas ne linkedlist
        const alreadyChosen = choosenWorker.some(
            (w) => w.name === worker.name && w.lastName === worker.lastName
        );
        if (!alreadyChosen) {
            setChoosenWorker((prevWorkers) => [...prevWorkers, worker]);
        }
    };
//-------------------------------renderinimo funkcijos
    const addTaskFieldForWorker = (workerId) => { 
        setTaskFields((prevFields) => {
            const updatedFields = { ...prevFields };
            if (!updatedFields[workerId]) {
                updatedFields[workerId] = [];
            }
            updatedFields[workerId] = [...updatedFields[workerId], { task: '', deadline: '', finished: false }];
            return updatedFields;
        });
    };

    const handleTaskNameChange = (workerId, taskIndex, event) => {
        setTaskFields((prevFields) => {
            const updatedFields = { ...prevFields };
            updatedFields[workerId][taskIndex].task = event.target.value;
            return updatedFields;
        });
    };

    // Handle deadline input change for a specific worker and task
    const handleDeadlineChange = (workerId, taskIndex, event) => {
        setTaskFields((prevFields) => {
            const updatedFields = { ...prevFields };
            updatedFields[workerId][taskIndex].deadline = event.target.value;
            return updatedFields;
        });
    };

    const handleProjectName = (event) =>
    {
        setProjectName(event.target.value);
    };

    const handleProjectDeadline = (event) =>
    {
        setProjectDeadline(event.target.value);
    };

    const handleProjectDescription = (event) => 
    {
        setProjectDescription(event.target.value);
    };

    const handleNewTaskName = (event) =>
    {
        setNewTask(event.target.value);
    };

    const HandleDateChange = (event) =>{
        setChangeDate(event.target.value);
    }

    const handleNewDate = (event) =>
    {
        setNewDate(event.target.value);
    };
//--------------------------------------

    const saveProjectToFile = (project) => {
        fetch("http://localhost:5000/save-project-file", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project }),
        })
    };
    

    const createProject = async () => { //projekto sukurimas txt dokumento
        
        const temp ={
            name: projectName,
            deadline: projectDeadline,
            participants: choosenWorker,
            numOfParticip: choosenWorker.length,
            description: projectDescription,
            tasks: taskFields,
        }
        saveProjectToFile(temp);
        console.log(temp.tasks);
        const response = await fetch('http://localhost:5000/worker/add-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(temp.tasks),
        });

        props.createProjec(temp);
        setProjectDeadline('');
        setProjectName('');
        setProjectDescription('');
        setTaskFields([]);
        setChoosenWorker([]);
    };

    

    const exportWorkerReport = (workerdata) => { //darbuotojo ataskaita
        const workerName = workerdata.data.name;
        
        const worker = workerData.find(w => w.name === workerName);//randamas darbuotojas ir jo uzduotys
        const { name, lastName, tasks } = worker;
        console.log(tasks);
        let reportContent = `Darbuotojo ${name} ${lastName} ataskaita\n\nUžduotys:\n`;
        tasks.forEach((task, index) => {
            const taskStatus = task.finished ? 'Baigta' : 'Nepabaigta';
            reportContent += `${index + 1}. Užduotis: ${task.task}, Terminas: ${task.deadline}, Statusas: ${taskStatus}\n`;
        });
    
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(blob);
    
        const link = document.createElement('a'); //sukuriamas failas parsisiusti
        link.href = fileUrl;
        link.download = `${name}_${lastName}_Ataskaita.txt`;
        link.click();
    
        URL.revokeObjectURL(fileUrl); 
        
    };

    const addTaskToWorker = async (name) =>{ //prideti uzduoti darbuotojui
        let temp;
        for (let i = 0; i < current.data.participantsList.getSize(); i++)
        {
            temp = current.data.participantsList.getNode(i);
            if (temp.data.nameOfPart.name === name)
                break;
        }

        const task ={
            deadline: newDate,
            finished: false,
            task: newTask,
        }
        console.log('alio');
        try {
            const response = await fetch('http://localhost:5000/add-task', { //pridedame i darbuotoju json faila nauja uzduoti
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    task: task.task,
                    deadline: task.deadline,
                }),
            });
        }
        catch{}

        const newTaskDate = new Date(task.deadline); //terminas
            
        if (temp.data.allTasks.getSize() === 0)
            temp.data.allTasks.add(task);
        else {
            let added = false;
            for (let i = 0; i < temp.data.allTasks.getSize(); i++) //ieskome kur pagal data galima ideti uzduoti
            {
            let taskEx = temp.data.allTasks.getNode(i);
            const tempDate = new Date(taskEx.data.deadline) 
            if (tempDate >= newTaskDate)
            {
                temp.data.allTasks.insertAt(i, task);
                added = true;
                break;
            }
            }
            if (!added)
            {
                temp.data.allTasks.add(task);
            }
        }
        
        setNewDate('');
        setNewTask('');
        triggerReRender();
        updateProjectFile();
    }



    const changeOldDate = (taskName, worker) =>{ //uzduoties termino pakeitimas
        if (changeDate)
        {
            let temp;
            for (let i = 0; i < current.data.participantsList.getSize(); i++) //susirandame darbuotoja
            {
                temp = current.data.participantsList.getNode(i);
                if (temp.data.nameOfPart.name === worker.name)
                    break;
            }
            console.log(worker);

            let list = temp;
            let temp2 = temp;
            let i;
            for (i = 0; i < temp.data.allTasks.getSize(); i++) //susirandame darbuotojo tam tikra uzduoti
            {
                temp2 = temp.data.allTasks.getNode(i);
                if (temp2.data.task === taskName)
                    break;
            }    
            let taskList = list.data.allTasks;
            
            const updatedTask = { ...(taskList.getNode(i)).data, deadline: changeDate };
            taskList.removeAt(i); //ja pasaliname

            let added = false;
            const newDeadline = new Date(changeDate);
            
            for (let i = 0; i < taskList.getSize(); i++) //pridedame is naujo is rikiavus
            {
                let taskEx = taskList.getNode(i);
                const tempDate = new Date(taskEx.data.deadline)
                if (tempDate >= newDeadline)
                {
                    taskList.insertAt(i, updatedTask);
                    added = true;
                    break;
                }
            }
            if (!added)
            {
                taskList.add(updatedTask);
            }
            
            fetch("http://localhost:5000/log-task-update", { //updatinam txt projekto
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskName: taskName,
                    status: "date-changed",
                    newDate: changeDate,
                    projectName: current.data.name,
                }),
            })

            fetch("http://localhost:5000/workers/update-task-deadline", {//updatinam darbuotojo jsona
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: worker,
                    taskName: taskName,
                    newDeadline: changeDate,
                }),
            })

            setChangeDate('');
            updateProjectFile(); //updatinam jsona projekto
            triggerReRender();
        } 
            
    }

    const finishTask = (taskName, worker) =>{

        let temp;
        for (let i = 0; i < current.data.participantsList.getSize(); i++) //susirandame darbuotoja
        {
            temp = current.data.participantsList.getNode(i);
            if (temp.data.nameOfPart.name === worker.name)
                break;
        }   
        
        console.log(worker);
        let list = temp;
        let temp2 = temp;
        let i;
        for (i = 0; i < temp.data.allTasks.getSize(); i++) //susirandame darbuotojo tam tikra uzduoti
        {
            temp2 = temp.data.allTasks.getNode(i);
            if (temp2.data.task === taskName)
                break;
        }    
        
        temp2.data.finished = true;//nustatome jog uzduotis baigta

        fetch("http://localhost:5000/log-task-update", {//atnaujiname txt faila
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskName: temp2.data.task,
                status: 'finished',
                projectName: current.data.name,
            }),
        })

        fetch("http://localhost:5000/workers/mark-task-finished", {//atnaujiname darbuotoju jsona
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: temp.data.nameOfPart.name,
                taskName: temp2.data.task,
            }),
        }) 
        updateProjectFile();
        triggerReRender();
    };

    if (props.newProj)
    {
        const elem = [];
        for (let i = 0; i < props.workers.getSize(); i++) //pereiname per darbuotoju linkedlista renderinimui
        {   
            let worker = props.workers.getNode(i);
            let temp = {
                name: worker.data.name,
                lastName: worker.data.lastName, 
                job: worker.data.job
            };
            elem.push(
                <div>
                    <a className="optionWorker" onClick={() => {
                        addWorker(temp);
                        }}>
                        {worker.data.name} {worker.data.lastName} {worker.data.job}</a>
                </div>
            )
        }
        return (
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">Naujas projektas</h1>
                </div>
                <div>
                    <h4 className="enterName">Įveskite projekto pavadinimą</h4> 
                    <input 
                        type="text"
                        value={projectName}
                        onChange={handleProjectName}
                    />
                    <h4 className="enterName">Įveskite projekto terminą</h4>
                    <input 
                        type="text"
                        value={projectDeadline}
                        onChange={handleProjectDeadline}
                        placeholder="(YYYY-MM-DD)"
                    />
                    <h4 className="enterName">Įveskite projekto aprašą</h4>
                    <textarea 
                        type="text"
                        value={projectDescription}
                        onChange={handleProjectDescription}
                    />
                </div> 
                <div>
                    <h2>Pasirinkite darbuotojus</h2>
                    {elem}
                </div>
                <div>
                    ____________
                </div>
                <div>
                    {choosenWorker.map((work)=>(
                        <div>
                            <div className="selected">
                            <a>{work.name} {work.lastName} {work.job}</a>
                            <button onClick={() => addTaskFieldForWorker(work.name)}>Pridėti užduotį</button>
                            <div>
                                {(taskFields[work.name] || []).map((task, index) => (
                                    <div>
                                        <input
                                            type="text"
                                            value={task.task}
                                            onChange={(e) => handleTaskNameChange(work.name, index, e)}
                                            placeholder="Užduoties pavadinimas"
                                        />
                                        <input
                                            type="text"
                                            value={task.deadline}
                                            onChange={(e) => handleDeadlineChange(work.name, index, e)}
                                            placeholder="Terminas(YYYY-MM-DD)"
                                        />
                                    </div>
                                ))}
                            </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="create">
                    <button onClick={() => createProject()}>Kurti projektą</button>
                </div>
            </div> 
        ); 
    }
    else if (props.workersDispl === true) //ataskaitu langas
    {
        const workersList = []; 
        for (let i = 0; i < props.workers.getSize(); i++)
        {
            let temp = props.workers.getNode(i);  
            workersList.push(
                <div className="worker">
                        <h1>{temp.data.name} {temp.data.lastName} {temp.data.job}</h1>
                        <button onClick={() => exportWorkerReport(temp)}>
                            Paruošti ataskaitą
                        </button>  
                </div>
            );
        }
        return (
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">Darbuotojai</h1>
                </div> 
                {workersList}
            </div> 
        ); 
    }
    else if (props.selectedProj == null)
    {
        return(
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">Pasirinkite projektą ar darbuotojus</h1> 
                </div>
            </div> 
        ); 
    }
    else {
        let projId = current.data.id;
        const work = [];
        const today = new Date();

        let late = 0, weekLeft = 0, dayLeft = 0, numTask = 0, notFinished = 0;
        const nameWorkers = [];

        for (let i = 0; i < current.data.participantsList.getSize(); i++) //einame per projekto darbuotojus
        {
            const temp = current.data.participantsList.getNode(i);
            const worker = temp.data.nameOfPart;
            const name = worker.name;
            const task = [];
            nameWorkers.push(
                <div>
                    <a className="optionWorker" onClick={() => addTaskToWorker(name)}>{name}</a>
                </div>
            )

            for (let j = 0; j < temp.data.allTasks.getSize(); j++) //einame per darbuotojo kiekvieno darbus
            {
                
                const taskData = temp.data.allTasks.getNode(j);
                const taskName = taskData.data.task;
                const deadlineDate = new Date(taskData.data.deadline);
                const timeDifference = (deadlineDate - today) / (1000 * 60 * 60 * 24);
                let week = false, day = false, lat = false;
                numTask += 1;
                if(timeDifference > 7 && taskData.data.finished === false)
                {
                    notFinished += 1;
                }   
                else if(timeDifference > 1 && taskData.data.finished === false)
                {
                    weekLeft += 1;
                    notFinished += 1;
                    week = true;
                }   
                else if (timeDifference > 0 && taskData.data.finished === false)
                {
                    dayLeft += 1;
                    notFinished += 1;
                    day = true;
                }   
                else if(taskData.data.finished === false){
                    late += 1;
                    lat = 1;
                    notFinished += 1;
                }
                
                task.push(
                    <div className="task">
                        <li className={
                            taskData.data.finished ? "finished-task" :
                            week === 1 ? "weekleft-task" :
                            day === 1 ? "dayleft-task" : 
                            lat === 1 ? "late-task":
                            ""
                            }>
                                {taskData.data.finished 
                                ? taskData.data.task 
                                : `${taskData.data.task} Terminas iki: ${taskData.data.deadline}`}
                                </li>
                        {taskData.data.finished ? "": (
                            <div>
                                <button onClick={() => finishTask(taskName, worker)}>Užbaigti užduotį</button>
                                <button onClick={() => changeOldDate(taskName, worker)}>Pakeisti terminą</button>
                            </div>
                            )}
                    </div>
                )
            }
            work.push(
                <div className="workerField">
                    <div className="workerName">
                        <div>
                            {worker.name} {worker.lastName} {worker.jobTitle}
                        </div>
                    </div>
                    Užduotys:  {worker.numOfTasks}
                    <div>
                        {task}
                    </div>
                </div>
            )
        }
        return (
            <div className="screen">
                <div className="alldetails">
                    <h1 className="projectName">{current.data.name}</h1>
                    <h1 className="endDate">Terminas iki: {current.data.endDate}</h1>
                </div>
                <div className="descript">
                    {current.data.description}
                </div>
                <div>
                    <input 
                    type="text" 
                    placeholder="Užd. pavadinimas"
                    value={newTask}
                    onChange={handleNewTaskName}
                    />
                    <input 
                    type="text" 
                    placeholder="(YYYY-MM-DD)"
                    value={newDate}
                    onChange={handleNewDate}
                    />
                    {nameWorkers}
                </div>
                <div className="dateChange">
                    <input 
                    type="text"
                    value={changeDate}
                    onChange={HandleDateChange}
                    placeholder="Iveskite datą ir pasirinkitę užduotį"
                    className="changedate"
                    />
                </div>
                <div className="descript">
                    {work}
                </div>
                <div>
                    <h3>Skubios užduotys(liko mažiau nei savaitė): {weekLeft}</h3>
                    <h3>Itin skubios(liko viena diena): {dayLeft}</h3>
                    <h3>Vėluojančios užduotys: {late}</h3>
                    <h3>Užduočių yra: {numTask}</h3>
                    <h2>Nebaigtų užduočių yra: {notFinished}</h2>
                </div>
                <div className="finish">
                    <button onClick={() => {
                        props.finish(projId);
                    }}>Užbaigti projektą</button>
                </div>
            </div>
        );
    }
}

export default ProjectDetails; 