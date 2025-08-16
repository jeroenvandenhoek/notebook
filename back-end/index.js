const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080;

const notebookDir = process.env.NOTEBOOK_PATH || path.join(__dirname, 'notebooks');

app.use(cors());
app.use(express.json());

// GET /files - Retrieve all file names in the notebook directory
app.get('/files', async (req, res) => {
  try {
    const files = await fs.readdir(notebookDir);
    res.json(files);
  } catch (error) {
    console.error('Error reading notebook directory:', error);
    res.status(500).send('Error reading notebook directory');
  }
});

// GET /files/:filename - Retrieve a single file's content
app.get('/files/:filename', async (req, res) => {
  const { filename } = req.params;

  // Security check to prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).send('Invalid filename');
  }

  const filePath = path.join(notebookDir, filename);

  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).send('File not found');
    }
    console.error(`Error reading file ${filename}:`, error);
    res.status(500).send('Error reading file');
  }
});

app.listen(port, () => {
  console.log(`Back-end server listening at http://localhost:${port}`);
});
