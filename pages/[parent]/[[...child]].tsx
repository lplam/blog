import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // or any other theme you prefer
import { Marked } from "marked";
import javascript from "highlight.js/lib/languages/javascript";
import { markedHighlight } from "marked-highlight";
import hljsZig from "../../utils/zig";
import { LineFocusPlugin } from "highlightjs-focus";
// import "highlight.js/styles/base16/equilibrium-light.css";
import Link from "next/link";
// import { DataService } from "../../utils/data";
// import { CommonSEO } from "../../components/SEO";
// import { base64_encode } from "../../utils/base64";
// import { SITE_URL } from "../../utils/consts";
import fs from "fs";
import { DataService } from "@/service/middleware";

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

  if (subpath === "__devmode") {
    markdown = fs.readFileSync("TEST.md", "utf-8");
    return {
      props: { markdown, postTitle, repo, subpath },
    };
  }
  const days = await DataService.allPosts();

  if (subpath) {
    // Subpath is requested
    console.log("subpath: ", subpath);
    const matchedIndex = days.findIndex((day) => day?.slug.match(subpath));
    if (matchedIndex !== -1) {
      // Found the matched post
      const matchedDay = days[matchedIndex];
      postTitle = matchedDay?.title ?? "";
      // const postDate = matchedDay.
      // const [postedDate, displayTitle] = postTitle.split(" - ");
      const [postedDate] = matchedDay.rawTokens[0].text.split("~");

      const displayTitle = postTitle;
      markdown = `\n\n# ${displayTitle}\n<div class="desc text-stone-500 font-mono text-sm">Posted On ${postedDate}</div>\n\n${matchedDay!.tokens.join(
        ""
      )}`;
    } else {
      markdown = `Hey! Look like you have lost your way, consider [going back](/${repo})?`;
    }
  } else {
    if (repo === "blog-markdown") {
      type PostEntry = {
        date: string;
        title: string;
        fullTitle: string;
        category: string;
        slug: string;
      };

      const posts: PostEntry[] = days
        .filter((day) => day.project === repo)
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
        .slice(0, 7)
        .map(
          (post) =>
            `\n<span class="text-stone-500 font-mono text-lg">${post.date}</span> <a class="font-mono text-lg" href="/${repo}/${post.slug}">${post.title}</a>`
        )
        .join("\n")}`;
    }
  }

  const isDevEnv = process.env.NODE_ENV === "development";
  if (markdown && repo) {
    return {
      revalidate: reload || isDevEnv ? 1 : 60 * 60,
      props: { markdown, postTitle, repo, subpath },
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
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  let content = marked.parse(markdown);

  const pageTitle = postTitle ? `${postTitle}` : "abc.test/" + repo;
  const description =
    markdown
      .split("\n")
      .filter(
        (line: string) =>
          !line.startsWith("# ") &&
          !line.startsWith("\n") &&
          line.length >= 5 &&
          line.indexOf("arrow pull-back") === -1
      )
      .slice(0, 3)
      .join(" ")
      .substr(0, 157) + "...";

  // const socialImage = postTitle
  //   ? `https://abc.test/api/image?t=${base64_encode(postTitle)}`
  //   : "https://abc.test/social-image.png";
  const isEntryContent = subpath.length;

  return (
    <>
      {/* <CommonSEO
        title={pageTitle}
        description={description}
        ogType={"article"}
        ogImage={socialImage}
      /> */}
      <main className="c-center">
        {!subpath && (
          <div className="relative mt-16">
            <input
              className="w-full h-12 rounded-xl search-color placeholder:font-medium placeholder:text-white pl-5 text-white font-medium text-xl font-mono"
              placeholder="Search something..."
            />
            <span className="material-symbols-outlined absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse text-3xl">
              search
            </span>
          </div>
        )}
        <div
          className={`markdown-body my-10 font-main text-sm md:text-[16px] ${
            isEntryContent ? "post-content" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </main>
    </>
  );
};

export default Devlog;
