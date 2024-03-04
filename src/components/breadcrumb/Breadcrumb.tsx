import { FC } from "react";
import { useRouter } from "next/router";
import BreadcrumbItem from "@/components/breadcrumb/BreadcrumbItem";

const Breadcrumb: FC<BreadCrumbProps> = ({
  chapterIndex,
  sectionIndex,
  items,
  isExamples = false,
}) => {
  const { name: chapterName, sections, base } = items[chapterIndex];
  const { name: sectionName } = sections[sectionIndex];
  const router = useRouter();
  const prefix = isExamples ? "playground" : "tutorial";

  return (
    <div className="flex flex-col md:flex-row gap-y-2 m-2">
      <BreadcrumbItem
        className={"z-[11]"}
        name={chapterName}
        activeIndex={chapterIndex}
        items={items}
        onClick={async (key) => {
          const { sections, base: newBase } = items[key];
          const firstSection = Object.keys(sections)[0];
          if (base === newBase) {
            return await router.push(`/${prefix}/${key}/${firstSection}`);
          }
          window.location.href = `/${prefix}/${key}/${firstSection}`;
        }}
      />
      <BreadcrumbItem
        name={sectionName}
        activeIndex={sectionIndex}
        items={sections}
        onClick={async (key) => {
          await router.push(`/${prefix}/${chapterIndex}/${key}`);
        }}
      />
    </div>
  );
};

interface BreadCrumbProps {
  chapterIndex: string;
  sectionIndex: string;
  isExamples?: boolean;
  items: Record<
    string,
    {
      name: string;
      base: string;
      sections: Record<
        string,
        {
          name: string;
        }
      >;
    }
  >;
}

export default Breadcrumb;
