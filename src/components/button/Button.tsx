import { FC, PropsWithChildren } from "react";

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  isLoading = false,
  onClick,
  className = "",
  children,
}) => {
  return (
    <button onClick={onClick} className={`btn my-1 ${className}`}>
      {isLoading && <span className="loading loading-spinner"></span>}
      {isLoading ? "Loading..." : children}
    </button>
  );
};

interface ButtonProps {
  isLoading?: boolean;
  className?: string;

  onClick?(): void;
}

export default Button;
