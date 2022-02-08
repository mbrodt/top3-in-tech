import { useState } from "react";
import confetti from "canvas-confetti";

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setStatus("error");
    }
  };
  return (
    <div className="pt-16 mb-16 lg:pt-32 xl:pt-40">
      <h1 className="text-4xl font-bold lg:text-5xl xl:text-6xl">
        Want to level up your development skills?
      </h1>
      <p className="mt-4 text-2xl lg:mt-8">
        Sign up to receive{" "}
        <span className="font-bold text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500">
          hand-crafted development advice
        </span>
        , updates on cool{" "}
        <span className="font-bold text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500">
          tools/frameworks
        </span>
        , and{" "}
        <span className="font-bold text-gradient bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500">
          amazing resources
        </span>{" "}
        directly from a seasoned front-end developer - every other week!
      </p>
      <p className="mt-12 mb-2 font-semibold lg:mb-4">
        Join 5000+ developers getting value from the Top 3 in Tech newsletter.
        No spam, unsubscribe any time.
      </p>
      {status !== "success" ? (
        <form className="flex flex-col sm:flex-row" onSubmit={submitEmail}>
          <input
            className="h-12 px-4 py-2 mb-2 text-lg text-gray-900 placeholder-gray-600 bg-white border-t border-b border-l border-r border-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-600 sm:flex-1 sm:rounded-r-none"
            name="email_address"
            aria-label="Your email address"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <button
            className="flex items-center justify-center h-12 px-4 py-2 text-lg font-bold text-white transition-shadow duration-150 ease-in rounded hover:shadow-2xl bg-gradient-to-r to-yellow-400 via-red-500 from-pink-500 sm:rounded-l-none"
            disabled={status === "working"}
          >
            <span>
              {status === "working" ? "Submitting..." : "Keep me updated"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 ml-2"
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
        <div className="font-bold">
          Thank you! One final step: check your email to confirm your
          subscription - and I'll keep you updated from there 🔥
        </div>
      )}
    </div>
  );
}
