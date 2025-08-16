const fs = require("fs/promises");
const { findFileRecursively } = require("../helpers/find-files-recursively");
const path = require("path");

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
    res.json({
      project: project,
      contents: fileContents,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).send("Project not found");
    }
    console.error(`Error reading file ${file} in project ${project}:`, error);
    res.status(500).send("Error reading file");
  }
};
