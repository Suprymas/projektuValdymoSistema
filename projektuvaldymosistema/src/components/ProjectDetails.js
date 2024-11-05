import React, {useState} from "react";
import './ProjectDetails.css';

const ProjectDetails = (props) =>{
    const [renderTrigger, setRenderTrigger] = useState(false);

    const triggerReRender = () => {
        setRenderTrigger(!renderTrigger);
    };

    


    const exportWorkerReport = (worker) => {
        const { name, lastName, tasks } = worker.data;
        let reportContent = `Darbuotojo ${name} ${lastName} ataskaita\n\nUžduotys:\n`;
    
        tasks.forEach((task, index) => {
          reportContent += `${index + 1}. Užduotis: ${task.task}, Terminas: ${task.deadline}\n`;
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
            temp.data.finished = true;
            triggerReRender();

        }
        else {

            temp = temp.data.participantsList.head.data.allTasks.head;
            while (temp.data.task !== taskName)
            {
                temp = temp.next;
            }
            temp.data.finished = true;
            triggerReRender();
        }
        


    };

    if (props.workersDispl === true)
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
        const work = [];
        const today = new Date();

        let late = 0, weekLeft = 0, dayLeft = 0, numTask = 0, notFinished = 0;

        while(curr != null)
        {
            const task = [];
            let curTask = curr.data.allTasks.head;
            const worker = curr.data.nameOfPart.name;
            
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
                        {curTask.data.finished ? "": <button onClick={() => finishTask(taskName, worker)}>Užbaigti užduotį</button>}
                    </div>
                )
                curTask = curTask.next;
            }

            work.push(
                <div className="workerField">
                    <div className="workerName">
                        {curr.data.nameOfPart.name} {curr.data.nameOfPart.lastName} {curr.data.nameOfPart.jobTitle}
                    </div>
                    Užduočių kiekis:  {curr.data.nameOfPart.numOfTasks}
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
            </div>
        );
        
    }
}

export default ProjectDetails; 