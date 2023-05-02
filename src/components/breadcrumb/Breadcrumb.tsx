import { FC } from "react";

const Breadcrumb: FC<BreadCrumbProps> = ({
  activeItemIndex,
  activeSectionIndex,
  items,
}) => {
  const { chapter, sections } = items[activeItemIndex];
  const activeSection = sections[activeSectionIndex];

  return (
    <nav className="flex justify-between" aria-label="Breadcrumb">
      <ol className="inline-flex items-center mb-3 sm:mb-0">
        <li>
          <div className="flex items-center">
            <button
              id="dropdownProject"
              data-dropdown-toggle="dropdown-project"
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-900  rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100"
            >
              {chapter}
              <svg
                className="w-5 h-5 ml-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              id="dropdown-project"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefault"
              >
                {items.map(({ chapter }, index) => {
                  const isSelected = index === activeItemIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        href="#"
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100`}
                      >
                        {chapter}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </li>
        <span className="mx-2 text-gray-400">/</span>
        <li aria-current="page">
          <div className="flex items-center">
            <button
              id="dropdownDatabase"
              data-dropdown-toggle="dropdown-database"
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-gray-600 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100"
            >
              {activeSection}
              <svg
                className="w-5 h-5 ml-1"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              id="dropdown-database"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefault"
              >
                {sections.map((section, index) => {
                  const isSelected = index === activeSectionIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        href="#"
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100`}
                      >
                        {section}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </li>
      </ol>
    </nav>
  );
};

interface BreadCrumbProps {
  activeItemIndex: number;
  activeSectionIndex: number;
  items: { chapter: string; sections: string[] }[];
}

export default Breadcrumb;
