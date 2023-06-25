import React from "react";

export type TextProps = {
  className?: string;
  variant?: "h1" | "h2" | "h3" | "span" | string;
  children?: React.ReactNode[] | React.ReactNode;
  fontFamily?: "Exo 2" | "Poppins";
  color?: string;
};
const TextAtom: React.FC<TextProps> = ({
  children,
  variant = "span",
  className,
  fontFamily = "Poppins",
  color = "White",
}) => {
  return React.createElement<React.HtmlHTMLAttributes<{}>>(
    variant,
    {
      className: `${className}`,
      style: { fontFamily: `"${fontFamily}"`, color: color },
    },
    children
  );
};

export default TextAtom;
