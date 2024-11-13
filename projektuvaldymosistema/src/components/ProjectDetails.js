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



    const updateProjectFile = () => {
        const updatedProject = {
            id: current.data.id,
            name: current.data.name,
            description: current.data.description,
            endDate: current.data.endDate,
            numOfParticip: current.data.numOfParticip,
            participants: [],
        };  

    
        // Serialize participants list
        let participantNode = current.data.participantsList.head;
        while (participantNode !== null) {
            const participant = participantNode.data;
    
            // Serialize tasks for each participant
            const tasksArray = [];
            let taskNode = participant.allTasks.head;
            while (taskNode !== null) {
                tasksArray.push({
                    task: taskNode.data.task,
                    deadline: taskNode.data.deadline,
                    finished: taskNode.data.finished,
                });
                taskNode = taskNode.next;
            }
    
            updatedProject.participants.push({
                name: participant.nameOfPart.name,
                lastName: participant.nameOfPart.lastName,
                jobTitle: participant.nameOfPart.jobTitle,
                numOfTasks: tasksArray.length,
                tasks: tasksArray,
            });
    
            participantNode = participantNode.next;
        }

        // Call API to save changes
        fetch("http://localhost:5000/update-project-json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project: updatedProject }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Project updated successfully:", data.message);
            })
            .catch(error => {
                console.error("Error updating project file:", error);
            });
    };





    const triggerReRender = () => {
        setRenderTrigger(!renderTrigger);
    };

    const addWorker = (worker) => {
        const alreadyChosen = choosenWorker.some(
            (w) => w.name === worker.name && w.lastName === worker.lastName
        );
        if (!alreadyChosen) {
            setChoosenWorker((prevWorkers) => [...prevWorkers, worker]);
        }
    };

    const addTaskFieldForWorker = (workerId) => {
        setTaskFields((prevFields) => {
            const updatedFields = { ...prevFields };
            // Initialize the worker's array if it doesn't exist
            if (!updatedFields[workerId]) {
                updatedFields[workerId] = [];
            }
            // Add a new task field set for this worker
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

    const handleNewDate = (event) =>
    {
        setNewDate(event.target.value);
    };








    const saveProjectToFile = (project) => {
        fetch("http://localhost:5000/save-project-file", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ project }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("File saved:", data.filePath);
                alert(`File saved successfully at ${data.filePath}`);
            })
            .catch(error => {
                console.error("Error saving file:", error);
                alert("Failed to save file.");
            });
    };
    

    const createProject = () => {
        
        const temp ={
            name: projectName,
            deadline: projectDeadline,
            participants: choosenWorker,
            numOfParticip: choosenWorker.length,
            description: projectDescription,
            tasks: taskFields,
        }
        console.log(temp);
        saveProjectToFile(temp);



        props.createProjec(temp);
     //   setProjectDeadline('');
     //   setProjectName('');
     //   setProjectDescription('');
     //   setTaskFields([]);
       // setChoosenWorker([]);
    };

    

    const exportWorkerReport = (workerdata) => {
        const workerName = workerdata.data.name;
        console.log(workerName);
        
        const worker = workerData.find(w => w.name === workerName);
        const { name, lastName, tasks } = worker;
        let reportContent = `Darbuotojo ${name} ${lastName} ataskaita\n\nUžduotys:\n`;
        tasks.forEach((task, index) => {
            const taskStatus = task.finished ? 'Baigta' : 'Nepabaigta';
            reportContent += `${index + 1}. Užduotis: ${task.task}, Terminas: ${task.deadline}, Statusas: ${taskStatus}\n`;
        });
    
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const fileUrl = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `${name}_${lastName}_Ataskaita.txt`;
        link.click();
    
        URL.revokeObjectURL(fileUrl); // Clean up the object URL after download
        
    };

    let current = props.projects.head;
    if (props.selectedProj !== null)
    {
        while (current.data.id !== props.selectedProj)
        {
            current = current.next;
        } 
    }  

    const addTaskToWorker = async (name) =>{
        let temp = current.data.participantsList.head;
        while (temp.data.nameOfPart.name !== name)
            temp = temp.next;

        const task ={
            deadline: newDate,
            finished: false,
            task: newTask,
        }
        console.log(name);
        try {
            const response = await fetch('http://localhost:5000/add-task', {
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
    
            if (response.ok) {
                // Task successfully added on the server, proceed with UI updates
                console.log('Task added successfully');
                setNewDate('');
                setNewTask('');
                triggerReRender();
                updateProjectFile();
            } else {
                const errorData = await response.json();
                console.error('Failed to add task:', errorData.error);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }

        let currentIndex = temp.data.allTasks.head;
        let index = 0;
        const newTaskDate = new Date(task.deadline);

        while (currentIndex && new Date(currentIndex.data.deadline) <= newTaskDate) {
            currentIndex = currentIndex.next;
            index++;
        }
        temp.data.allTasks.insertAt(index, task);
        setNewDate('');
        setNewTask('');
        triggerReRender();
        updateProjectFile();
    }

    const HandleDateChange = (event) =>{
        setChangeDate(event.target.value);
    }

    const changeOldDate = (taskName, worker) =>{
        let temp = current.data.participantsList.head;
        while (temp.data.nameOfPart.name !== worker)
            temp = temp.next;
        let list = temp;
        
        
        temp = temp.data.allTasks.head;
        while (temp.data.task !== taskName)
            temp = temp.next;
        let taskList = list.data.allTasks;
        let taskNode = list.data.allTasks.head;
        let taskIndex = 0;
        console.log(taskNode);
        // Find the task node and its index
        while (taskNode && taskNode.data.task !== taskName) {
            taskNode = taskNode.next;
            taskIndex++;
        }
        
        if (changeDate)
        {
            
            const updatedTask = { ...taskNode.data, deadline: changeDate };
            
            // Remove the task using removeAt
            list.data.allTasks.removeAt(taskIndex);
            
            // Determine the correct position for the updated task
            let currentIndex = taskList.head;
            let newIndex = 0;
            const newDeadline = new Date(changeDate);
            
            while (currentIndex) {
                const currentDeadline = new Date(currentIndex.data.deadline);
                if (newDeadline < currentDeadline) {
                    break;
                }
                currentIndex = currentIndex.next;
                newIndex++;
            }
            let projectName = current.data.name;
            // Reinsert the task at the correct position using insertAt
            taskList.insertAt(newIndex, updatedTask);
            fetch("http://localhost:5000/log-task-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskName: taskName,
                    status: "date-changed",
                    newDate: changeDate,
                    projectName: projectName,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Task update logged:", data.message);
                })
                .catch((error) => {
                    console.error("Error logging task update:", error);
                });

            fetch("http://localhost:5000/log-task-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskName: taskName,
                    status: "date-changed",
                    newDate: changeDate,
                    projectName: projectName,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("Task update logged:", data.message);
            })
            .catch((error) => {
                console.error("Error logging task update:", error);
            });


            fetch("http://localhost:5000/workers/update-task-deadline", {
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
            .then((response) => response.json())
            .then((data) => {
                console.log("Task update logged:", data.message);
            })
            .catch((error) => {
                console.error("Error logging task update:", error);
            });

            setChangeDate('');
            triggerReRender();
            updateProjectFile();
        } 
    }
















    const finishTask = (taskName, worker) =>{


        let temp = current; 
        if (temp.data.participantsList.head.data.nameOfPart.name !== worker)
        {
            temp = temp.data.participantsList.head.next;
            while (temp.data.nameOfPart.name !== worker)
            {
                temp = temp.next;
            }
            temp = temp.data.allTasks.head;
            while (temp.data.task !== taskName)
            {
                temp = temp.next;
            }
        }
        else {
            
            temp = temp.data.participantsList.head.data.allTasks.head;

            while (temp.data.task !== taskName)
            {
                temp = temp.next;
            }
        }
        temp.data.finished = true;
        let projectName = current.data.name;
        fetch("http://localhost:5000/log-task-update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskName: taskName,
                status: "finished",
                projectName: projectName,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Task update logged:", data.message);
        })
        .catch((error) => {
            console.error("Error logging task update:", error);
        });

        fetch("http://localhost:5000/workers/mark-task-finished", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: worker,
                taskName: taskName,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("Task update logged:", data.message);
        })
        .catch((error) => {
            console.error("Error logging task update:", error);
        });




        triggerReRender();
        updateProjectFile();


    };



    if (props.newProj)
    {
        let curWorkers = props.workers.head;
        const elem = [];
        const selected =[];
        while(curWorkers != null)
        {
            let temp = {
                name: curWorkers.data.name,
                lastName: curWorkers.data.lastName, 
                job: curWorkers.data.job
            };
            elem.push(
                <div>
                    <a className="optionWorker" onClick={() => {
                        addWorker(temp);
                        }}>
                        {curWorkers.data.name} {curWorkers.data.lastName} {curWorkers.data.job}</a>
                </div>
            )
            curWorkers = curWorkers.next;

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
    else if (props.workersDispl === true)
    {
        let current = props.workers.head; // Start from the head of the linked list
        const workersList = []; 
        while (current != null) {
            let temp = current;  
            workersList.push(
                <div className="worker">
                        <h1>{current.data.name} {current.data.lastName} {current.data.job}</h1>
                        <button onClick={() => exportWorkerReport(temp)}>
                            Paruošti ataskaitą
                        </button>  
                </div>
            );

            current = current.next; // Move to the next node
            
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
        let curr = current.data.participantsList.head;
        let projId = current.data.id;
        const work = [];
        const today = new Date();

        let late = 0, weekLeft = 0, dayLeft = 0, numTask = 0, notFinished = 0;
        const nameWorkers = [];
        while(curr != null)
        {
            const task = [];
            
            let curTask = curr.data.allTasks.head;
            const worker = curr.data.nameOfPart.name;
            let name = curr.data.nameOfPart.name;
            nameWorkers.push(
                <div>
                    <a className="optionWorker" onClick={() => addTaskToWorker(name)}>{curr.data.nameOfPart.name}</a>
                </div>
            )
            while(curTask != null)
            {
                const taskName = curTask.data.task;

                const deadlineDate = new Date(curTask.data.deadline);
                const timeDifference = (deadlineDate - today) / (1000 * 60 * 60 * 24);
                let week = 0, day = 0, lat = 0;
                numTask += 1;
                if(timeDifference > 7 && curTask.data.finished === false)
                {notFinished += 1;}
                else if(timeDifference > 1 && curTask.data.finished === false)
                {
                    weekLeft += 1;
                    notFinished += 1;
                    week = 1;
                } else if (timeDifference > 0 && curTask.data.finished === false){
                    dayLeft += 1;
                    day = 1;
                    notFinished += 1;
                } else if(curTask.data.finished === false){
                    late += 1;
                    lat = 1;
                    notFinished += 1;
                }
                task.push(
                    <div className="task">
                        <li className={
                            curTask.data.finished ? "finished-task" :
                            week === 1 ? "weekleft-task" :
                            day === 1 ? "dayleft-task" : 
                            lat === 1 ? "late-task":
                            ""
                            }>
                                {curTask.data.finished 
                                ? curTask.data.task 
                                : `${curTask.data.task} Terminas iki: ${curTask.data.deadline}`}
                                </li>
                        {curTask.data.finished ? "": (
                            <div>
                                <button onClick={() => finishTask(taskName, worker)}>Užbaigti užduotį</button>
                                <button onClick={() => changeOldDate(taskName, worker)}>Pakeisti terminą</button>
                            </div>
                            )}
                    </div>
                )
                curTask = curTask.next;
            }

            work.push(
                <div className="workerField">
                    <div className="workerName">
                        <div>
                            {curr.data.nameOfPart.name} {curr.data.nameOfPart.lastName} {curr.data.nameOfPart.jobTitle}
                        </div>
                    </div>
                    Užduotys:  {curr.data.nameOfPart.numOfTasks}
                    <div>
                        {task}
                    </div>
                </div>
            )
            curr = curr.next;
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