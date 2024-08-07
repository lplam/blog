import Head from "next/head";
import { useRouter } from "next/router";
// import { SITE_NAME, SITE_URL, TWITTER_USER } from "../utils/consts";

export type CommonSEOProps = {
  title: string;
  description: string;
  ogType: string;
  ogImage: string;
  noIndex?: boolean;
};

export const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  noIndex,
}: CommonSEOProps) => {
  const router = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`https://lplam.me${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="lplam.me" />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={ogImage} key={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <link rel="canonical" href={`https://lplam.me${router.asPath}`} />
      {noIndex ? <meta name="googlebot" content="noindex" /> : null}
    </Head>
  );
};
