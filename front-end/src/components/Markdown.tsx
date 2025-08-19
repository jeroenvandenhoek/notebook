import ReactMarkdown from "react-markdown";

interface Props {
  children: string;
}
export const Markdown = ({ children }: Props) => {
  return <ReactMarkdown>{children}</ReactMarkdown>;
};
