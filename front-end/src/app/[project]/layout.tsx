"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectFile {
  fileName: string;
}

interface Project {
  projectName: string;
  files: ProjectFile[];
}

interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8080/files");
        if (!response.ok) {
          console.error("Failed to fetch projects");
          return;
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleFileClick = (projectName: string, fileName: string) => {
    // The backend API for fetching a file seems to only support lookup by
    // file basename inside a project, not by a nested path.
    const basename = fileName.split("/").pop();
    if (!basename) {
      return;
    }
    router.push(`/${projectName}/${basename}`);
  };

  return (
    <div className="flex">
      <div
        style={{
          width: "250px",
          minWidth: "250px",
          borderRight: "1px solid #e0e0e0",
          padding: "1rem",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Projects</h2>
        {projects.map((project) => (
          <div key={project.projectName}>
            <h3>{project.projectName}</h3>
            <ul style={{ paddingLeft: "1rem", listStyle: "none" }}>
              {project.files.map((file) => (
                <li key={file.fileName} style={{ marginBottom: "0.5rem" }}>
                  <button
                    onClick={() =>
                      handleFileClick(project.projectName, file.fileName)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {file.fileName}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <main style={{ padding: "1rem", flexGrow: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
