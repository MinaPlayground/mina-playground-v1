import { FC } from "react";
import Link from "next/link";

const HeroSection: FC = () => {
  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-200 md:text-5xl lg:text-6xl">
          All-in-One Platform for Mina Protocol
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 lg:px-48">
          With Mina Playground you can create, test and run zkApps/Smart
          Contracts, deploy your own Smart Contracts and follow interactive
          tutorials.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
          <Link
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-blue-800 focus:ring-4 focus:ring-white"
            href="/tutorial/01-introduction/01-o1js"
          >
            Follow a tutorial
            <svg
              aria-hidden="true"
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          {/*<Link*/}
          {/*  href="/project"*/}
          {/*  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-400 rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-600 focus:ring-4 focus:ring-gray-100"*/}
          {/*>*/}
          {/*  Create a project*/}
          {/*</Link>*/}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
