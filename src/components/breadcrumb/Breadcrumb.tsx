import { FC } from "react";
import { useRouter } from "next/router";
import BreadcrumbItem from "@/components/breadcrumb/BreadcrumbItem";

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
    <>
      <BreadcrumbItem
        name={sectionName}
        activeIndex={sectionIndex}
        items={sections}
        onClick={(key) => {
          setSection(key);
          router.push(`/tutorial/${chapterIndex}/${key}`, undefined, {
            shallow: true,
          });
        }}
      />
    </>
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
