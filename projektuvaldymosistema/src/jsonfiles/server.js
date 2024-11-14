const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


app.post('/log-task-update', (req, res) => {
    const { taskName, status, newDate, projectName, deadline } = req.body;
    const timestamp = new Date().toISOString().split('T')[0];

    const logFilePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments',
        `${projectName}-log.txt`
    );

    let logMessage;
    if (status === 'finished') {
        logMessage = `\n${taskName} - baigta (${timestamp})`;
    } else if (status === 'date-changed') {
        logMessage = `\n${taskName} - pakeista data į ${newDate} (${timestamp})`;
    } else if (status === 'projec-finito') {
        const end = new Date(deadline);
        if (new Date() <= end)
        {
            logMessage = `\n------------------------Projektas baigtas laiku (${timestamp})------------------------`;
        }
        else {
            logMessage = `\n------------------------Projektas baigtas veluojant (${timestamp})--------------------`;
        }
        
    }

    fs.appendFile(logFilePath, logMessage + '\n', (err) => {
        if (err) {
            console.error('Error appending to log file:', err);
            return res.status(500).json({ error: 'Failed to log task update' });
        }

        res.json({ message: 'Task update logged successfully' });
    });
});

app.post('/update-project-text-document', (req, res) => {
    const { project } = req.body;
    const formattedDate = new Date().toISOString().split('T')[0];

    let fileContent = `
    ${project.name}

    Aprašymas:      ${project.description}
    Terminas:       ${project.deadline}
    Pradžios Data:  ${formattedDate}
    `;



    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments', 
        `${project.name}.txt`);


    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error("Error saving the file:", err);
            return res.status(500).json({ error: "Error saving the file" });
        }
        res.json({ message: "File saved successfully", filePath });
    });
});

app.post('/update-project-json', (req, res) => {
    const { project } = req.body;

    const jsonFilePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'projects.json'
    );

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: 'Error reading JSON file' });
        }

        let projectsArray = [];
        try {
            projectsArray = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON file:', parseErr);
            return res.status(500).json({ error: 'Invalid JSON file format' });
        }


        const existingProjectIndex = projectsArray.findIndex(p => p.id === project.id);

        if (existingProjectIndex !== -1) {
            projectsArray[existingProjectIndex] = project;
        } else {
            projectsArray.push(project);
        }

        // Write the updated array back to the file
        fs.writeFile(jsonFilePath, JSON.stringify(projectsArray, null, 2), (err) => {
            if (err) {
                console.error('Error writing to JSON file:', err);
                return res.status(500).json({ error: 'Failed to save project' });
            }
            res.json({ message: 'Project updated successfully' });
        });
    });
});


app.post('/save-project-file', (req, res) => {
    const { project } = req.body;
    const timestamp = new Date().toISOString().split('T')[0];


    const content = `${project.name}\n\n` +
        `Aprašymas:      ${project.description}\n` +
        `Terminas:       ${project.deadline}\n` +
        `Pradžios Data:  ${timestamp}\n`;


    const fileName = `${project.name}-log.txt`;
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments', 
        fileName
    );

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }


    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error('Error creating file:', err);
            return res.status(500).json({ error: 'Failed to create the file.' });
        }

        console.log('File created successfully:', filePath);
        res.json({ message: 'File created successfully.', filePath });
    });
});

app.post('/add-task', (req, res) => {
    const { name, task, deadline } = req.body;
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'workers.json'
    );


    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read worker data.' });
        }

        let workers = JSON.parse(data);
        const worker = workers.find(w => w.name === name);

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found.' });
        }


        const newTask = {
            task,
            deadline,
            finished: false
        };

        worker.tasks.push(newTask); 


        fs.writeFile(filePath, JSON.stringify(workers, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update worker data.' });
            }
            res.json({ message: 'Task added successfully.' });
        });
    });
});


app.post('/workers/mark-task-finished', (req, res) => {
    const { name, taskName } = req.body;
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'workers.json'
    );
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read worker data.' });

        let workers = JSON.parse(data);
        const worker = workers.find(w => w.name === name);

        if (!worker) return res.status(404).json({ error: 'Worker not found.' });

        const task = worker.tasks.find(t => t.task === taskName);

        if (!task) return res.status(404).json({ error: 'Task not found.' });


        task.finished = true;


        fs.writeFile(filePath, JSON.stringify(workers, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update worker data.' });
            res.json({ message: 'Task marked as finished successfully.' });
        });
    });
});

app.post('/workers/update-task-deadline', (req, res) => {
    const { name, taskName, newDeadline } = req.body;
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'workers.json'
    );
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read worker data.' });

        let workers = JSON.parse(data);
        const worker = workers.find(w => w.name === name);

        if (!worker) return res.status(404).json({ error: 'Worker not found.' });

        const task = worker.tasks.find(t => t.task === taskName);

        if (!task) return res.status(404).json({ error: 'Task not found.' });


        task.deadline = newDeadline;

        fs.writeFile(filePath, JSON.stringify(workers, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update worker data.' });
            res.json({ message: 'Task deadline updated successfully.' });
        });
    });
});

app.post('/worker/add-tasks', (req, res) => {
    const workersTasks = req.body; // Expecting an object like { "Petras": [...tasks], "Matas": [...tasks] }
    const workersFilePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'workers.json'
    );
    if (!workersTasks || typeof workersTasks !== 'object') {
        return res.status(400).json({ message: 'Invalid input. Please provide tasks for workers in a valid object.' });
    }

    // Read the current workers JSON file
    fs.readFile(workersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading workers file.' });
        }

        let workers;
        try {
            workers = JSON.parse(data); // Parse JSON file content
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ message: 'Error parsing workers data.' });
        }

        // Update tasks for each worker
        for (const [workerName, tasks] of Object.entries(workersTasks)) {
            const worker = workers.find(worker => worker.name === workerName);
            if (worker) {
                worker.tasks.push(...tasks); // Add tasks to the worker
            }
        }

        // Write updated workers back to the file
        fs.writeFile(workersFilePath, JSON.stringify(workers, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ message: 'Error saving tasks to workers file.' });
            }

            return res.status(200).json({ message: 'Tasks added successfully.', workers });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
