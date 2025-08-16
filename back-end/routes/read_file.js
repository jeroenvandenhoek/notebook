const fs = require('fs/promises');
const path = require('path');

module.exports = (notebookDir) => async (req, res) => {
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
};
