import React from "react";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <section className="bg-white lg:grid lg:h-screen lg:place-content-center dark:bg-gray-900">
        <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32">
          <div className="max-w-prose text-left">
            {/* Hero Text */}
            <h1 className="text-4xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Test Your Knowledge,
              <strong className="text-indigo-600">
                {" "}
                Challenge Your Friends!{" "}
              </strong>
              The Ultimate Quiz Experience Awaits
            </h1>
            {/* home page's list */}
            <ul className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
              <li>📌 Create Quizzes – Craft fun and challenging questions</li>
              <li>📌 Compete in Real-Time – Answer fast, score high!</li>
              <li>📌 Climb the Leaderboard – Earn bragging rights</li>
              <li>🏆 Ready to prove your skills?</li>
            </ul>
            <br />
            Let’s get started!
            <div className="mt-4 flex gap-4 sm:mt-6">
              {/* register button */}
              <a
                className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                href="api/users/register"
              >
                Get Started
              </a>

              {/* login button */}
              <a
                className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                href="api/users/login"
              >
                Login
              </a>
            </div>
          </div>

          {/* Home image */}
          <Image
            src="/homeimg.png" // ✅ Correct path for public images
            alt="Home Png"
            width={400} // Set appropriate width & height
            height={300}
            className="mx-auto hidden max-w-md text-gray-900 md:block dark:text-white"
          />
        </div>
      </section>
      ;
    </div>
  );
};

export default page;
