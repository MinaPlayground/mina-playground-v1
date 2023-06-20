import { FC } from "react";

const SelectList: FC<SelectListProps> = ({ title, items }) => {
  if (!items) return null;
  return (
    <div className="py-2.5">
      <select className="h-10 w-full rounded border-r-8 border-transparent px-4 text-sm outline outline-neutral-700">
        <option value="none">{title}</option>
        {Object.entries(items).map(([key, value], index) => (
          <option key={index} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
};

interface SelectListProps {
  title: string;
  items: Record<string, any>;
}

export default SelectList;
