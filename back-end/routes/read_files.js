const fs = require('fs/promises');

module.exports = (notebookDir) => async (req, res) => {
  try {
    const files = await fs.readdir(notebookDir);
    res.json(files);
  } catch (error) {
    console.error('Error reading notebook directory:', error);
    res.status(500).send('Error reading notebook directory');
  }
};
