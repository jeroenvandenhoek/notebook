"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface ProjectFile {
  fileName: string;
}

interface Project {
  project: string;
  files: ProjectFile[];
}

interface Props {
  children: ReactNode;
}
const Layout = ({ children }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const params = useParams();

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

  const composeRoute = (projectName: string, fileName: string) => {
    // The backend API for fetching a file seems to only support lookup by
    // file basename inside a project, not by a nested path.
    const basename = fileName.split("/").pop();
    if (!basename) {
      return;
    }
    // router.push(`/${projectName}/${basename}`);
    return `/${projectName}/${basename}`;
  };

  return (
    <div className="flex">
      <div className="h-screen w-64 border-e-1 overflow-y-auto">
        <h2 className="sr-only">Projects</h2>
        {projects.map((project) => (
          <div key={project.project}>
            <h3 className="px-2 text-xl text-amber-300">{project.project}</h3>
            <ul>
              {project.files.map((file) => {
                const basename = file.fileName.split("/").pop() || "";
                const isActive =
                  project.project === params.project &&
                  basename === params.file;
                return (
                  <li
                    key={file.fileName}
                    className="w-full mb-1 overflow-x-clip"
                  >
                    <Link
                      href={composeRoute(project.project, file.fileName) ?? "/"}
                      className={`w-full flex justify-start cursor-pointer hover:bg-teal-900 pt-2 pb-0.5 ${isActive ? "border-b-1 border-b-teal-600 mx-2" : "px-2"}`}
                    >
                      {file.fileName.split("/").pop()?.split(".").shift()}
                    </Link>
                  </li>
                );
              })}
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
