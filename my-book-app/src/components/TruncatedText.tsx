import { useState } from "react";

/* 
   TruncatedText Component:
   - Truncates text to a specified limit and adds ellipsis if needed.
*/

// Props for the TruncatedText component
interface TruncatedTextProps {
  text: string;
  limit?: number; // default limit is 50 characters
}

// Component to truncate text to a specified limit
const TruncatedText = ({ text, limit = 50 }: TruncatedTextProps) => {
  const [expanded, setExpanded] = useState(false);
  if (text.length <= limit) return <span className="break-all">{text}</span>;
  
  if (!expanded) {
    const truncated = text.substring(0, limit) + "... ";
    return (
      <span className="break-all">
        {truncated}
        <button onClick={() => setExpanded(true)} className="text-blue-500 underline">
          Read more
        </button>
      </span>
    );
  } else {
    return (
      <span className="break-all">
        {text}{" "}
        <button onClick={() => setExpanded(false)} className="text-blue-500 underline">
          Collapse
        </button>
      </span>
    );
  }
};

export default TruncatedText;
