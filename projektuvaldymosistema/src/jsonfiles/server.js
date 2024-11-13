const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS package
const { time } = require('console');

const app = express();
const PORT = 5000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// OR, to restrict it to a specific origin:
// app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/log-task-update', (req, res) => {
    const { taskName, status, newDate, projectName, deadline } = req.body;
    const timestamp = new Date().toISOString().split('T')[0];
    // Define the content of the text file based on the project object
    const logFilePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments',
        `${projectName}-log.txt`
    );

    // Determine the log message
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
        
    } else {
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Append the log message to the file
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

    // Define the content of the text file based on the project object
    let fileContent = `
    ${project.name}

    Aprašymas:      ${project.description}
    Terminas:       ${project.deadline}
    Pradžios Data:  ${formattedDate}
    `;


    // Specify the file path on your computer (you can change this path)
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments', 
        `${project.name}.txt`);

    // Write the content to a file
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

        // Check if the project already exists (match by unique id)
        const existingProjectIndex = projectsArray.findIndex(p => p.id === project.id);

        if (existingProjectIndex !== -1) {
            // Update existing project
            projectsArray[existingProjectIndex] = project;
        } else {
            // Add new project
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

    // Format the content
    const content = `${project.name}\n\n` +
        `Aprašymas:      ${project.description}\n` +
        `Terminas:       ${project.deadline}\n` +
        `Pradžios Data:  ${timestamp}\n`;

    // Define the file path and name
    const fileName = `${project.name}-log.txt`;
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/projectDocuments', 
        fileName
    );

    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write the content to the file
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

    // Read the existing worker data
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read worker data.' });
        }

        let workers = JSON.parse(data);
        const worker = workers.find(w => w.name === name);

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found.' });
        }

        // Create new task object
        const newTask = {
            task,
            deadline,
            finished: false
        };

        // Insert new task in the correct position
        worker.tasks.push(newTask); // Add new task to the end

        // Write updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(workers, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update worker data.' });
            }
            res.json({ message: 'Task added successfully.' });
        });
    });
});


app.post('/workers/mark-task-finished', (req, res) => {
    const { name, taskName } = req.body; // Now using taskName instead of taskIndex
    const filePath = path.join(
        'C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', 
        'workers.json'
    );
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read worker data.' });

        let workers = JSON.parse(data);
        const worker = workers.find(w => w.name === name);

        if (!worker) return res.status(404).json({ error: 'Worker not found.' });

        // Find the task by taskName
        const task = worker.tasks.find(t => t.task === taskName);

        if (!task) return res.status(404).json({ error: 'Task not found.' });

        // Mark the task as finished
        task.finished = true;

        // Write updated data back to the JSON file
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

        // Update the deadline of the task
        task.deadline = newDeadline;

        // Write updated data back to the JSON file
        fs.writeFile(filePath, JSON.stringify(workers, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update worker data.' });
            res.json({ message: 'Task deadline updated successfully.' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
