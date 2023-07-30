import { FC } from "react";

const SectionItem: FC = () => {
  return (
    <div className="shadow-2xl opacity-90 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg p-8 md:p-12 mb-8">
      <a
        href="#"
        className="bg-white text-black text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md mb-2"
      >
        <svg
          className="w-3 h-3 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
        Tutorials
      </a>
      <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-2">
        How to setup and create a zkApp
      </h1>
      <p className="text-lg font-normal text-white mb-6">
        Follow our interactive tutorial and learn how to setup and create your
        own zkApp with a step-to-step guide.
      </p>
      <a
        href="#"
        className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center rounded-lg bg-gray-100 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
      >
        Read more
        <svg
          aria-hidden="true"
          className="ml-2 -mr-1 w-4 h-4"
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
      </a>
    </div>
  );
};

export default SectionItem;
