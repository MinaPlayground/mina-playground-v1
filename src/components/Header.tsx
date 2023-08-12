import { FC } from "react";
import Link from "next/link";

const Header: FC = () => {
  return (
    <>
      <div className="drawer">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-gray-800">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                className="btn text-white btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <div className="flex-1 px-2 mx-2">
              <a href="/" className="btn btn-ghost normal-case text-xl">
                <img
                  alt={"icon"}
                  src="/icon.svg"
                  height={32}
                  width={32}
                  className="mr-2 border-2 rounded"
                />
                <span className="self-center text-2xl text-white font-semibold whitespace-nowrap">
                  Mina Playground
                </span>
              </a>
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu text-white menu-horizontal">
                <li>
                  <Link href={"/"}>Home</Link>
                </li>
                <li>
                  <Link href="/tutorial/01-introduction/01-smart-contracts">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/project">Projects</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="drawer-side z-[100]">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 h-full text-white bg-gray-800">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href="/tutorial/01-introduction/01-smart-contracts">
                Tutorials
              </Link>
            </li>
            <li>
              <Link href="/project">Projects</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-br from-pink-500 to-orange-400" />
    </>
  );
};

export default Header;
