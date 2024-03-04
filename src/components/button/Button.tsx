import { FC, PropsWithChildren } from "react";

const Button: FC<PropsWithChildren<ButtonProps>> = ({
  isLoading = false,
  onClick,
  className = "",
  children,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`btn my-1 ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading && <span className="loading loading-spinner"></span>}
      {isLoading ? "Loading..." : children}
    </button>
  );
};

interface ButtonProps {
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;

  onClick?(): void;
}

export default Button;
