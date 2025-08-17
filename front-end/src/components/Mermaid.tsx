"use client";

import { useEffect } from "react";
import mermaid from "mermaid";

const diagramId = "mermaid-diagram-container";

export default function Mermaid({ chart }: { chart: string }) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      const container = document.getElementById(diagramId);
      if (container) {
        try {
          const { svg } = await mermaid.render("graphDiv", chart);
          container.innerHTML = svg;
        } catch (error) {
          container.innerHTML = `<pre>${error instanceof Error ? error.message : "Error rendering diagram"}</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return <div className="w-full" id={diagramId} />;
}
