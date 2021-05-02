import Head from "next/head";
import Feed from "../components/feed";
import Subscribe from "../components/subscribe";

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/[.]/g, "-") // Replace multiple . with -
    .replace(/[/]/g, "-") // Replace multiple / with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export async function getServerSideProps() {
  const res = await fetch(
    `https://api.convertkit.com/v3/broadcasts?api_secret=${process.env.API_SECRET}`
  );

  const BASE_URL = "https://madsbrodt.ck.page/posts";
  const posts = await res.json();

  // Filter to only Top 3 broadcasts
  const feed = posts.broadcasts
    .filter(
      (post, index, self) =>
        post.subject.startsWith("Top 3") &&
        self.findIndex((p) => p.subject === post.subject) === index
    )
    // Map to include published URL
    .map((post, index) => {
      const url = `${BASE_URL}/${slugify(post.subject)}`;
      return {
        issue: index + 1,
        url,
        ...post,
      };
    });

  const newestBroadcast = feed[feed.length - 1];

  // Get detailed stats for the last broadcast
  const singleResponse = await fetch(
    `https://api.convertkit.com/v3/broadcasts/${newestBroadcast.id}/stats?api_secret=${process.env.API_SECRET}`
  );
  const singleStats = await singleResponse.json();

  // Check if the last broadcast is not published - and hide it if that's the case
  const publishedFeed = feed.filter((post) => {
    if (
      post.id === singleStats.broadcast.id &&
      singleStats.broadcast.status !== "published"
    ) {
      return false;
    }
    return true;
  });

  return {
    props: {
      publishedFeed,
    },
  };
}

export default function Home({ publishedFeed }) {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white pb-8">
      <Head>
        <title>Top 3 in Tech newsletter</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@madsbrodt" />
        <meta name="twitter:creator" content="@madsbrodt" />
        <meta name="twitter:title" content="Become a better developer" />
        <meta
          name="twitter:description"
          content="Get amazing resources, tech updates, and development advice directly to your inbox - every week"
        />
        <meta name="twitter:image" content="/top3_meta.png" />
        <meta property="og:url" content="https://mads.fyi/top3" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Become a better developer" />
        <meta
          property="og:description"
          content="Get amazing resources, tech updates, and development advice directly to your inbox - every week"
        />
        <meta property="og:image" content="/top3_meta.png" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xl lg:max-w-2xl mx-auto px-4">
        <Subscribe />
        <Feed feed={publishedFeed} />
      </div>
      <script
        async
        defer
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
      <noscript>
        <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" />
      </noscript>
    </div>
  );
}
