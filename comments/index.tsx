import React, { useEffect, useRef } from "react";

const Comments: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.async = true;
    scriptElement.crossOrigin = "anonymous";
    scriptElement.src = "https://utteranc.es/client.js";

    scriptElement.setAttribute("issue-term", "url");
    scriptElement.setAttribute("label", "comment");
    scriptElement.setAttribute("repo", "lplam/blog");
    scriptElement.setAttribute("theme", "preferred-color-scheme");

    ref.current?.appendChild(scriptElement);
  }, []);

  return <div ref={ref} />;
};

export default Comments;
