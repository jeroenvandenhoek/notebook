"use client";

import { useEffect, useState } from "react";

type PageProps = {
  params: {
    project: string;
    file: string;
  };
};

export default function Page({ params }: PageProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const { project, file } = params;
    if (!project || !file) return;

    const eventSource = new EventSource(
      `http://localhost:8080/stream/${project}/${file}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.contents) {
          setContent(data.contents);
        }
      } catch (error) {
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
  }, [params]);

  return <main>{content}</main>;
}
