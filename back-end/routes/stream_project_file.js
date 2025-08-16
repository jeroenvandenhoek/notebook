const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const { findFileRecursively } = require("../helpers/find-files-recursively");

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

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sendEvent = async () => {
      try {
        const fileContents = await fsPromises.readFile(filePath, "utf8");
        const payload = {
          project: project,
          contents: fileContents,
        };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      } catch (e) {
        console.error(`Error sending file event for ${filePath}:`, e);
      }
    };

    // Send initial content
    await sendEvent();

    // Watch for changes and send updates
    const listener = (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        sendEvent();
      }
    };

    fs.watchFile(filePath, { interval: 1000 }, listener);

    // Stop watching when client disconnects
    req.on("close", () => {
      fs.unwatchFile(filePath, listener);
      res.end();
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).send("Project not found");
    }
    console.error(`Error reading file ${file} in project ${project}:`, error);
    res.status(500).send("Error reading file");
  }
};
