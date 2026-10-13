
import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#41413d] disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#41413d] text-white hover:bg-[#292925]",

    secondary:
      "border border-[#41413d] bg-transparent text-[#41413d] hover:bg-[#41413d] hover:text-white",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
