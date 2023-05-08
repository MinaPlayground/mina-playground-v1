import { FC } from "react";

const BreadcrumbButton: FC<BreadCrumbButtonProps> = ({
  name,
  type = "secondary",
  id,
}) => {
  const textStyle = type === "primary" ? "text-gray-900" : "text-gray-600";
  return (
    <button
      data-dropdown-toggle={id}
      className={`inline-flex items-center px-3 py-2 text-sm font-normal text-center ${textStyle} rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-100`}
    >
      {name}
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
  );
};

interface BreadCrumbButtonProps {
  name: string;
  type?: "primary" | "secondary";
  id: string;
}

export default BreadcrumbButton;
