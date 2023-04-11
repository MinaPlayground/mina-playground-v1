import { FC } from "react";

const ReadMoreSection: FC = () => {
  return (
    <section className="bg-white">
      <div className="px-4 mx-auto max-w-screen-xl mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12 mb-8">
          <a
            href="#"
            className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md mb-2"
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
          <h1 className="text-gray-900 text-3xl md:text-5xl font-extrabold mb-2">
            How to setup and create a zkApp
          </h1>
          <p className="text-lg font-normal text-gray-500 mb-6">
            Follow our interactive tutorial and learn how to setup and create
            your own zkApp with a step-to-step guide.
          </p>
          <a
            href="#"
            className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-black hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
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
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
            <a
              href="#"
              className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md mb-2"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                />
              </svg>
              Projects
            </a>
            <h2 className="text-gray-900 text-3xl font-extrabold mb-2">
              Manage your zkApp and Smart Contract projects
            </h2>
            <p className="text-lg font-normal text-gray-500 mb-4">
              Create and manage public/private zkApp and Smart Contract
              projects.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline font-medium text-lg inline-flex items-center"
            >
              Read more
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
            <a
              href="#"
              className="bg-gradient-to-br from-pink-500 to-orange-400 text-white text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-md mb-2"
            >
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                />
              </svg>
              Smart Contracts
            </a>
            <h2 className="text-gray-900 text-3xl font-extrabold mb-2">
              Deploy Smart Contracts in seconds
            </h2>
            <p className="text-lg font-normal text-gray-500 mb-4">
              Deploy Smart Contracts easily and directly using our web
              interface.
            </p>
            <a
              href="#"
              className="text-blue-600 hover:underline font-medium text-lg inline-flex items-center"
            >
              Read more
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadMoreSection;
