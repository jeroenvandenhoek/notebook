const fs = require("fs");
const path = require("path");

export const findFileRecursively = async (directory, fileName) => {
  const dirents = fs.readdir(directory, { withFileTypes: true });
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
