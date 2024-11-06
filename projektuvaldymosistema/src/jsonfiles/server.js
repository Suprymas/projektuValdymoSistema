const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = 5000;

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// OR, to restrict it to a specific origin:
// app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/save-project-file', (req, res) => {
    const { project } = req.body;

    // Define the content of the text file based on the project object
    let fileContent = `
    Project Name: ${project.name}
    Description: ${project.description}
    End Date: ${project.deadline}
    Number of Participants: ${project.numOfParticip}

    Participants and Tasks:
    `;

    project.participants.forEach((participant) => {
        fileContent += `
        Name: ${participant.name} ${participant.lastName}
        Job Title: ${participant.job}
        Tasks:
        `;

        Object.entries(project.tasks).map(([name, tasks]) => {
            if (participant.name === name){
                tasks.map(task=>{
                    fileContent += `
                    -${task.task}
                    -Terminas: ${task.deadline}
                    -Ar užbaigta: ${task.finished ? 'Taip' : 'Ne'}
                    `
                })
            }
        }
        );


    });

    // Specify the file path on your computer (you can change this path)
    const filePath = path.join('C:/Users/Justas/Desktop/projektuvaldymosistema/httpsgithubcomSuprymasprojektuValdymoSistema1/projektuvaldymosistema/src/jsonfiles', `${project.name}.txt`);

    // Write the content to a file
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error("Error saving the file:", err);
            return res.status(500).json({ error: "Error saving the file" });
        }
        res.json({ message: "File saved successfully", filePath });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
