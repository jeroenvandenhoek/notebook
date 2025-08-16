"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

type MermaidProps = {
  chart: string;
};

const Mermaid = ({ chart }: MermaidProps) => {
  useEffect(() => {
    if (chart) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });
      mermaid.run();
    }
  }, [chart]);

  if (!chart) {
    return null;
  }

  return <pre className="mermaid">{chart}</pre>;
};

export default Mermaid;
