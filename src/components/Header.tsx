import { FC } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Header: FC = () => {
  return (
    <nav className="bg-gradient-to-br from-pink-500 to-orange-400 border-gray-200">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <img
            alt={"icon"}
            src="./icon.svg"
            height={32}
            width={32}
            className="mr-2 border-2 rounded"
          />
          <span className="self-center text-2xl text-white font-semibold whitespace-nowrap">
            Mina Playground
          </span>
        </a>
        <div className="flex items-center md:order-2">
          <button
            type="button"
            className="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <UserCircleIcon className="w-8 h-8 rounded-full text-gray-100" />
          </button>
          <div
            className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow"
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">Test User</span>
              <span className="block text-sm  text-gray-500 truncate">
                test@minaplayground.com
              </span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg md:hidden hover:bg-gradient-to-br from-pink-500 to-orange-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="mobile-menu-2"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <a
                href="/"
                className="block py-2 pl-3 pr-4 text-white font-bold bg-gray-600 rounded md:bg-transparent md:text-white md:p-0 underline underline-offset-4"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-gray-600 md:hover:bg-transparent md:hover:text-gray-700 md:p-0"
              >
                Tutorials
              </a>
            </li>
            <li>
              <a
                href="/projects"
                className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-gray-600 md:hover:bg-transparent md:hover:text-gray-700 md:p-0"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 pl-3 pr-4 text-white rounded hover:bg-gray-100 hover:text-gray-600 md:hover:bg-transparent md:hover:text-gray-700 md:p-0"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
