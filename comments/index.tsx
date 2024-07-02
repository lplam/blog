"use client";

import { useEffect, useRef } from "react";

const Comments = ({ issueTerm }: { issueTerm: string }) => {
  const commentsSection = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("issueTerm", issueTerm);
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("repo", "shade-cool/article");
    script.setAttribute("issue-term", issueTerm);
    script.setAttribute("theme", "github-light");
    if (commentsSection.current) {
      commentsSection.current.appendChild(script);
    }
  }, []);

  return <div ref={commentsSection} />;
};

export default Comments;
