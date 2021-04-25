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
  const feed = posts.broadcasts
    .filter(
      (post, index, self) =>
        post.subject.startsWith("Top 3") &&
        self.findIndex((p) => p.subject === post.subject) === index
    )

    .map((post, index) => {
      const url = `${BASE_URL}/${slugify(post.subject)}`;
      console.log("url:", url);
      return {
        issue: index + 1,
        url,
        ...post,
      };
    });

  return {
    props: {
      feed,
    },
  };
}

export default function Home({ feed }) {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      <Head>
        <title>Top 3 in Tech newsletter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-xl lg:max-w-2xl mx-auto px-4">
        <Subscribe />
        <Feed feed={feed} />
      </div>
    </div>
  );
}
