const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 8080;

const notebookDir =
  process.env.NOTEBOOK_PATH || path.join(__dirname, "notebooks");

const readFilesHandler = require("./routes/read_files")(notebookDir);
const readProjectFileHandler = require("./routes/read_project_file")(
  notebookDir,
);
const streamProjectFileHandler = require("./routes/stream_project_file")(
  notebookDir,
);

app.use(cors());
app.use(express.json());

// GET /files - Retrieve all file names in the notebook directory
app.get("/files", readFilesHandler);

// GET /:project/:file - Retrieve a single file's content
app.get("/:project/:file", readProjectFileHandler);

// GET /stream/:project/:file - Stream a single file's content
app.get("/stream/:project/:file", streamProjectFileHandler);

app.listen(port, () => {
  console.log(`Back-end server listening at http://localhost:${port}`);
});
