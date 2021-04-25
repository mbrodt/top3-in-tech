const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    dateStyle: "long",
  };
  const formatted = new Intl.DateTimeFormat(`en-US`, options).format(date);

  return formatted;
};

export default function Feed({ feed }) {
  return (
    <div className="">
      <h2 className="text-2xl mb-4">Check out past issues:</h2>
      <div className="grid grid-cols-1 gap-8">
        {[...feed].reverse().map((post, index) => (
          <a
            className="bg-white rounded-lg p-4 text-gray-900"
            key={post.id}
            href={post.url}
            rel="noopener noreferer"
            target="_blank"
          >
            <div className="flex justify-between">
              <span className="text-gray-600">
                Issue #{post.issue} - published on {formatDate(post.created_at)}
              </span>
              <div></div>
            </div>
            <p className="text-3xl font-bold mt-2 mb-4 leading-8">
              {post.subject}
            </p>
            <button className="bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 text-white rounded-lg font-bold py-2 px-4 flex items-center">
              <span>Read it</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </a>
        ))}
      </div>
    </div>
  );
}
