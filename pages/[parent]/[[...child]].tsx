import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // or any other theme you prefer
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
// import "highlight.js/styles/base16/equilibrium-light.css";
// import { DataService } from "../../utils/data";
// import { CommonSEO } from "../../components/SEO";
// import { base64_encode } from "../../utils/base64";
// import { SITE_URL } from "../../utils/consts";
import { CommonSEO } from "@/SEO";
import Comments from "@/comments";
import { ENABLED_PROJECTS } from "@/service/const";
import { DataService } from "@/service/middleware";
import fs from "fs";
import { useEffect, useState } from "react";

// hljs.registerLanguage("javascript", javascript);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let repo = context.params?.parent ?? null;
  let rest = context.params?.child ?? null;

  let subpath = "";
  let reload = false;
  if (rest?.length) {
    subpath = rest[0];
    reload = !!rest[1];
  }

  let markdown = "";
  let postTitle = "";
  let description = "";
  let thumbnail = "";
  type PostEntry = {
    date: string;
    title: string;
    fullTitle: string;
    category: string;
    slug: string;
  };
  let posts: PostEntry[] = [];

  if (subpath === "__devmode") {
    markdown = fs.readFileSync("TEST.md", "utf-8");
    return {
      props: { markdown, postTitle, repo, subpath, thumbnail },
    };
  }
  const days = await DataService.allPosts();

  if (subpath) {
    const matchedIndex = days.findIndex((day) => day?.slug.match(subpath));
    if (matchedIndex !== -1) {
      const matchedDay = days[matchedIndex];
      matchedDay!.tokens.shift();
      postTitle = matchedDay?.title ?? "";
      const [postedDate, p2, p3, p4] = matchedDay.rawTokens[0].text.split("~");
      description = p3;
      thumbnail = p4;

      const displayTitle = postTitle;
      markdown = `\n\n# ${displayTitle}\n<div class="desc text-stone-500 font-mono text-sm">Posted On ${postedDate}<span> - By: Lam Boyer</span></div> \n\n${matchedDay!.tokens.join(
        ""
      )}`;
    } else {
      markdown = `Hey! Look like you have lost your way, consider [going back](/${repo})?`;
    }
  } else {
    if (repo === "blog") {
      posts = days
        .filter((day) => day.project === ENABLED_PROJECTS[0])
        .map((day, k) => {
          const [date, title, description] = day.rawTokens[0].text.split("~");
          const fullTitle = title;
          const category = "category";
          return {
            date,
            title,
            fullTitle,
            category,
            slug: day.slug,
          };
        });

      markdown = `${posts
        .map(
          (post) =>
            `\n<span class="text-stone-500 font-mono text-[1rem] md:text-lg">${post.date}</span> <a class="font-mono text-[1rem] md:text-lg" href="/${repo}/${post.slug}">${post.title}</a>`
        )
        .join("\n")}`;
    } else if (repo === "portfolio") {
      // const content = days.find((day) => day.project === "portfolio-markdown");
      // markdown = `\n\n${content!.tokens.join("")}`;
      markdown = fs.readFileSync("portfolio.md", "utf-8");
    }
  }

  const isDevEnv = process.env.NODE_ENV === "development";
  if (markdown && repo) {
    return {
      revalidate: reload || isDevEnv ? 1 : 60 * 60,
      props: {
        markdown,
        postTitle,
        repo,
        subpath,
        description,
        thumbnail,
        posts: posts,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

const Devlog: NextPage = ({
  markdown,
  postTitle,
  repo,
  subpath,
  description,
  thumbnail,
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [markdownFiltered, setMarkdownFiltered] = useState(markdown);
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  const pageTitle = postTitle ? `${postTitle}` : "lplam.me/" + repo;

  const socialImage =
    thumbnail ||
    "https://static.semrush.com/blog/uploads/media/e6/b7/e6b7699595cb741570c9b385fa8f7971/javascript.svg";
  const isEntryContent = subpath.length;

  const filteredPosts = posts.filter((post: any) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log(subpath, repo);
    if (!subpath && repo !== "portfolio") {
      console.log("heheh");
      setMarkdownFiltered(
        filteredPosts.length === 0
          ? ""
          : filteredPosts
              .map(
                (post: any) =>
                  `\n<span class="text-stone-500 font-mono text-[1rem] md:text-lg">${post.date}</span> <a class="font-mono text-[1rem] md:text-lg" href="/${repo}/${post.slug}">${post.title}</a>`
              )
              .join("\n")
      );
    }
  }, [searchQuery]);

  let content = marked.parse(markdownFiltered);

  return (
    <>
      <CommonSEO
        title={pageTitle}
        description={description}
        ogType={"article"}
        ogImage={socialImage}
      />
      <main className="c-center pb-[50px]">
        {!subpath && repo !== "portfolio" && (
          <div className="relative mt-16">
            <input
              className="w-full h-12 rounded-xl search-color placeholder:font-medium placeholder:text-white pl-5 text-white font-medium text-[1rem] md:text-xl font-mono"
              placeholder="Search something..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse text-2xl md:text-3xl">
              search
            </span>
          </div>
        )}
        <div
          className={`markdown-body my-10 font-mono text-xs md:text-[16px] ${
            isEntryContent ? "post-content" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        {subpath && <Comments issueTerm={subpath} />}
      </main>
    </>
  );
};

export default Devlog;
