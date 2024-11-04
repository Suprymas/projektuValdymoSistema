import React from "react";
import './ProjectDetails.css';

const ProjectDetails = (props) =>{


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
            console.log(current);  
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

        while(curr != null)
        {
            const task = [];
            let curTask = curr.data.allTasks.head;
            while(curTask != null)
            {
                task.push(
                    <div className="task">
                        <li className={curTask.data.isFinished ? "" : "unfinished-task"}>{curTask.data.task} Terminas iki: {curTask.data.deadline}</li>
                        <button>Užbaigti užduotį</button>
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
            </div>
        );
    }
}

export default ProjectDetails; 