import type { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => {
  return (
    <button
      {...props}
      className={`bg-black text-white dark:text-black dark:bg-white font-medium rounded-md py-1 px-2 hover:ring-4 ring-black/10 dark:ring-white/20 ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
