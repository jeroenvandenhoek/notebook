"use client";

import { ReactNode, useEffect, useRef } from "react";
import mermaid from "mermaid";

interface Props {
  content?: string;
  children?: ReactNode;
}
/**
 *
 * use content when you have a string that is pure mermaid
 * use children when you have a markdown component that contains mermaid code
 */
export default function Mermaid({ content, children }: Props) {
  const divElement = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!divElement.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
    });

    if (!!content) {
      mermaid.run({ nodes: [divElement.current] });
      return;
    }
    mermaid.run({ querySelector: ".language-mermaid" });
  }, [children, divElement, content]);

  return (
    <div
      className={`w-full h-full px-6 py-4 markdown-body ${content ? "flex justify-center" : ""}`}
      ref={divElement}
    >
      {content ? content : children}
    </div>
  );
}
