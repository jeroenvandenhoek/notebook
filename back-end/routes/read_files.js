const fs = require('fs/promises');
const path = require('path');

const getFilesRecursively = async (dir, relativeTo) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const resPath = path.resolve(dir, dirent.name);
      if (dirent.isDirectory()) {
        return getFilesRecursively(resPath, relativeTo);
      } else {
        return { fileName: path.relative(relativeTo, resPath) };
      }
    })
  );
  return files.flat();
};

module.exports = (notebookDir) => async (req, res) => {
  try {
    const dirents = await fs.readdir(notebookDir, { withFileTypes: true });
    const projects = await Promise.all(
      dirents
        .filter((dirent) => dirent.isDirectory())
        .map(async (dirent) => {
          const projectPath = path.join(notebookDir, dirent.name);
          const files = await getFilesRecursively(projectPath, projectPath);
          return {
            project: dirent.name,
            files: files,
          };
        })
    );
    res.json(projects);
  } catch (error) {
    console.error('Error reading notebook directory:', error);
    res.status(500).send('Error reading notebook directory');
  }
};
