import { ChangeEvent, FC } from "react";
import { isArray } from "lodash";

const SelectList: FC<SelectListProps> = ({ title, items, onChange }) => {
  if (!items) return null;

  const selectItems = isArray(items)
    ? items.map((item, index) => (
        <option key={index} value={item}>
          {item}
        </option>
      ))
    : Object.entries(items).map(([key, value], index) => (
        <option key={index} value={key}>
          {key}
        </option>
      ));
  return (
    <div className="py-2.5">
      <select
        onChange={onChange}
        className="h-10 w-full bg-gray-700 rounded border-r-8 border-transparent px-4 text-sm"
      >
        <option value="">{title}</option>
        {selectItems}
      </select>
    </div>
  );
};

interface SelectListProps {
  title: string;
  items: string[] | Record<string, any>;
  onChange(event: ChangeEvent<HTMLSelectElement>): void;
}

export default SelectList;
