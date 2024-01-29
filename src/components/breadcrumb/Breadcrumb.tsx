import { FC } from "react";
import { useRouter } from "next/router";
import BreadcrumbItem from "@/components/breadcrumb/BreadcrumbItem";

const Breadcrumb: FC<BreadCrumbProps> = ({
  chapterIndex,
  sectionIndex,
  items,
}) => {
  const { name: chapterName, sections } = items[chapterIndex];
  const { name: sectionName } = sections[sectionIndex];
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row gap-y-2 m-2">
      <BreadcrumbItem
        className={"z-[11]"}
        name={chapterName}
        activeIndex={chapterIndex}
        items={items}
        onClick={async (key) => {
          const firstSection = Object.keys(items[key].sections)[0];
          await router.push(`/playground/${key}/${firstSection}`);
        }}
      />
      <BreadcrumbItem
        name={sectionName}
        activeIndex={sectionIndex}
        items={sections}
        onClick={async (key) => {
          await router.push(`/playground/${chapterIndex}/${key}`);
        }}
      />
    </div>
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
}

export default Breadcrumb;
