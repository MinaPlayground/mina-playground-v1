import { FC } from "react";
import BreadcrumbButton from "@/components/breadcrumb/BreadcrumbButton";

const Breadcrumb: FC<BreadCrumbProps> = ({
  chapterIndex,
  sectionIndex,
  setChapter,
  setSection,
  items,
}) => {
  const { chapter, sections } = items[chapterIndex];
  const activeSection = sections[sectionIndex];

  return (
    <nav className="flex justify-between" aria-label="Breadcrumb">
      <ol className="inline-flex items-center mb-3 sm:mb-0">
        <li>
          <div className="flex items-center">
            <BreadcrumbButton
              name={chapter}
              id={"dropdown-primary"}
              type={"primary"}
            />
            <div
              id="dropdown-primary"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefault"
              >
                {items.map(({ chapter }, index) => {
                  const isSelected = index === chapterIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        onClick={() => setChapter(index)}
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100 cursor-pointer`}
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
            <BreadcrumbButton
              name={activeSection.name}
              id={"dropdown-secondary"}
            />
            <div
              id="dropdown-secondary"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefault"
              >
                {sections.map((section, index) => {
                  const isSelected = index === sectionIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        onClick={() => setSection(index)}
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                      >
                        {section.name}
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
  chapterIndex: number;
  sectionIndex: number;
  items: {
    chapter: string;
    sections: { name: string }[];
  }[];
  setChapter(chapter: number): void;
  setSection(section: number): void;
}

export default Breadcrumb;
