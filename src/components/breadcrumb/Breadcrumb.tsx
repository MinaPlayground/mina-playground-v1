import { FC } from "react";
import BreadcrumbButton from "@/components/breadcrumb/BreadcrumbButton";
import { useRouter } from "next/router";

const Breadcrumb: FC<BreadCrumbProps> = ({
  chapterIndex,
  sectionIndex,
  setChapter,
  setSection,
  items,
}) => {
  const { name: chapterName, sections } = items[chapterIndex];
  const { name: sectionName } = sections[sectionIndex];
  const router = useRouter();

  return (
    <nav className="flex justify-between" aria-label="Breadcrumb">
      <ol className="inline-flex items-center mb-3 sm:mb-0">
        <li>
          <div className="flex items-center">
            <BreadcrumbButton
              name={chapterName}
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
                {Object.entries(items).map(([key, value]) => {
                  const { name } = value;
                  const isSelected = key === chapterIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        onClick={() => {
                          // router.push(`/tutorial?c=${chapter});
                          // chapter only init base code in webcontainer
                          // setChapter(index);
                        }}
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                      >
                        {name}
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
            <BreadcrumbButton name={sectionName} id={"dropdown-secondary"} />
            <div
              id="dropdown-secondary"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
            >
              <ul
                className="py-2 text-sm text-gray-700"
                aria-labelledby="dropdownDefault"
              >
                {Object.entries(sections).map(([key, value], index) => {
                  const { name } = value;
                  const isSelected = key === sectionIndex;
                  const isSelectedStyle = isSelected ? "bg-gray-100" : "";
                  return (
                    <li>
                      <a
                        onClick={() => {
                          setSection(key);
                          router.push(
                            `/tutorial/${chapterIndex}/${key}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                        className={`${isSelectedStyle} block px-4 py-2 hover:bg-gray-100 cursor-pointer`}
                      >
                        {name}
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
  chapterIndex: string;
  sectionIndex: string;
  items: Record<
    string,
    {
      name: string;
      sections: Record<
        string,
        {
          name: string;
        }
      >;
    }
  >;
  setChapter(chapter: string): void;
  setSection(section: string): void;
}

export default Breadcrumb;
