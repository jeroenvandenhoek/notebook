"use client";

import { use, useEffect, useState } from "react";
import Mermaid from "../../../components/Mermaid";

type PageProps = {
  params: Promise<{
    project: string;
    file: string;
  }>;
};

export default function Page({ params }: PageProps) {
  const [content, setContent] = useState("");
  const { project, file } = use(params);

  useEffect(() => {
    if (!project || !file) return;

    const eventSource = new EventSource(
      `http://localhost:8080/stream/${project}/${file}`,
    );

    eventSource.onmessage = (event) => {
      console.log("message recieved");
      try {
        const data = JSON.parse(event.data);
        if (data.contents) {
          setContent(data.contents);
        }
      } catch (error) {
        console.log("no message no mas");
        console.error("Failed to parse SSE data:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [project, file, setContent]);

  return (
    <main className="w-full h-full flex justify-around items-center">
      <Mermaid chart={content} />
    </main>
  );
}
