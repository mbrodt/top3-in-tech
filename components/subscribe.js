import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submitEmail = async (e) => {
    const api_key = process.env.NEXT_PUBLIC_API_PUBLIC;
    setStatus("working");
    e.preventDefault();
    const data = {
      email,
      api_key,
    };
    const res = await fetch(
      "https://api.convertkit.com/v3/forms/1918924/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      }
    );
    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };
  return (
    <div className="mb-16 pt-16 lg:pt-32 xl:pt-40">
      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
        Want to level up your development skills?
      </h1>
      <p className="mt-4 text-2xl lg:mt-8">
        Sign up to receive{" "}
        <span className="text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 font-bold">
          amazing resources
        </span>
        , updates on cool{" "}
        <span className="text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 font-bold">
          tools/frameworks
        </span>
        , and{" "}
        <span className="text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 font-bold">
          hand-crafted advice
        </span>{" "}
        directly from me - every week!
      </p>
      <p className="mt-12 mb-2 lg:mb-4 font-semibold">
        Join 2600+ developers getting value from the Top 3 in Tech newsletter.
        No spam, unsubscribe any time.
      </p>
      {status !== "success" ? (
        <form className="flex flex-col sm:flex-row" onSubmit={submitEmail}>
          <input
            className="focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-white border-l border-t border-b border-r border-white rounded px-4 py-2 text-lg text-gray-900 placeholder-gray-600 mb-2 h-12 sm:flex-1 sm:rounded-r-none"
            name="email_address"
            aria-label="Your email address"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <button
            className="rounded hover:shadow-2xl duration-150 transition-shadow ease-in bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 text-white font-bold py-2 px-4 text-lg h-12 flex items-center justify-center sm:rounded-l-none"
            disabled={status === "working"}
          >
            <span>
              {status === "working" ? "Submitting..." : "Keep me updated"}
            </span>
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
          {status === "error" && (
            <p className="mt-2">
              Something went wrong. Please try again, and let me know if it
              keeps happening.
            </p>
          )}
        </form>
      ) : (
        <div className="font-semibold">
          Thank you! Now, check your email to confirm your subscription - then
          I'll keep you updated 🔥
        </div>
      )}
    </div>
  );
}
