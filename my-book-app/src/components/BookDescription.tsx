/* 
   BookDescription Component:
   - Renders a sanitized HTML formatted book description.
*/
import DOMPurify from "dompurify";

// Props for the BookDescription component
interface BookDescriptionProps {
  description: string;
}

// Component to display a sanitized book description
const BookDescription = ({ description }: BookDescriptionProps) => {
  // Sanitize the description HTML
  const sanitized = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br", "p"],
    ALLOWED_ATTR: []
  });
  
  return (
    <div
      className="mt-4 leading-relaxed text-gray-300"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default BookDescription;