const fs = require("fs/promises");
const path = require("path");

const findFileRecursively = async (directory, fileName) => {
  const dirents = await fs.readdir(directory, { withFileTypes: true });
  for (const dirent of dirents) {
    const fullPath = path.join(directory, dirent.name);
    if (dirent.isDirectory()) {
      const result = await findFileRecursively(fullPath, fileName);
      if (result) {
        return result;
      }
    } else if (dirent.name === fileName) {
      return fullPath;
    }
  }
  return null;
};

module.exports = (notebookDir) => async (req, res) => {
  const { project, file } = req.params;

  // Security check to prevent directory traversal
  if (
    project.includes("..") ||
    project.includes("/") ||
    file.includes("..") ||
    file.includes("/")
  ) {
    return res.status(400).send("Invalid path");
  }

  const projectPath = path.join(notebookDir, project);

  try {
    const filePath = await findFileRecursively(projectPath, file);

    if (!filePath) {
      return res.status(404).send("File not found");
    }

    const fileContents = await fs.readFile(filePath, "utf8");

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const payload = {
      project: project,
      contents: fileContents,
    };

    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    res.end();
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).send("Project not found");
    }
    console.error(`Error reading file ${file} in project ${project}:`, error);
    res.status(500).send("Error reading file");
  }
};
