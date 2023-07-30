import { FC, useEffect, useRef, useState } from "react";

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  name,
  activeIndex,
  onClick,
  items,
}) => {
  const selectMenuRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState(false);

  useEffect(() => {
    const handleSelectMenu = (e: Event) => {
      if (!selectMenuRef.current?.contains(e.target as Element)) {
        setState(false);
      }
    };

    document.addEventListener("click", handleSelectMenu);
  }, []);

  return (
    <div className="relative max-w-42 sm:w-64 px-2 text-base z-10">
      <button
        ref={selectMenuRef}
        className="flex items-center justify-between gap-2 w-full px-3 py-2 text-gray-200 bg-gray-700 rounded-md shadow-sm cursor-default outline-none focus:border-gray-400"
        aria-haspopup="true"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        onClick={() => setState(!state)}
      >
        <div className="flex items-center gap-x-3">
          <span className={`text-sm`}>{name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {state ? (
        <div className="relative w-full">
          <ul
            className="absolute w-full overflow-y-auto bg-white border rounded-md shadow-sm max-h-64"
            role="listbox"
          >
            {Object.entries(items).map(([key, value], index) => {
              const { name } = value;
              const isSelected = key === activeIndex;
              return (
                <li
                  key={index}
                  onClick={() => onClick(key)}
                  role="option"
                  aria-selected={isSelected}
                  className={`${
                    isSelected ? "text-indigo-600 bg-indigo-50" : ""
                  } flex items-center justify-between gap-2 px-3 cursor-default py-2 duration-150 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50`}
                >
                  <div className="flex items-center gap-x-3">{name}</div>
                  {isSelected ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    ""
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

interface BreadcrumbItemProps {
  name: string;
  activeIndex: string;
  items: Record<
    string,
    {
      name: string;
    }
  >;

  onClick(key: string): void;
}

export default BreadcrumbItem;
