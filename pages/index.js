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
  const page1 = await fetch(
    `https://api.convertkit.com/v3/broadcasts?api_secret=${process.env.API_SECRET}`
  );
  const page2 = await fetch(
    `https://api.convertkit.com/v3/broadcasts?api_secret=${process.env.API_SECRET}&page=2`
  );
  console.log("page2:", page2);

  const BASE_URL = "https://madsbrodt.ck.page/posts";
  const posts1 = await page1.json();
  console.log("posts1:", posts1);
  const posts2 = await page2.json();
  console.log("posts2:", posts2);

  const posts = [...posts1.broadcasts, ...posts2.broadcasts];

  // Filter to only Top 3 broadcasts
  const feed = posts
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

  // Hide the last broadcast if it's not completed
  const publishedFeed = feed.filter((post) => {
    if (
      post.id === singleStats.broadcast.id &&
      singleStats.broadcast.stats.status !== "completed"
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
    <div className="w-full min-h-screen pb-8 text-white bg-gray-900">
      <Head>
        <title>Top 3 in Tech newsletter</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@madsbrodt" />
        <meta name="twitter:creator" content="@madsbrodt" />
        <meta name="twitter:title" content="Become a better developer" />
        <meta
          name="twitter:description"
          content="Get amazing resources, tech updates, and development advice directly to your inbox - every other week"
        />
        <meta
          name="twitter:image"
          content="https://top3-in-tech.netlify.app/top3_meta.png"
        />
        <meta property="og:url" content="https://mads.fyi/top3" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Become a better developer" />
        <meta
          property="og:description"
          content="Get amazing resources, tech updates, and development advice directly to your inbox - every other week"
        />
        <meta
          property="og:image"
          content="https://top3-in-tech.netlify.app/top3_meta.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xl px-4 mx-auto lg:max-w-2xl">
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
