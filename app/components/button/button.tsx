import React from "react";
import styles from "./styles.module.css";

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & { type: "submit" | "button" | "reset" }
>(({ children, ...props }, ref) => {
  return (
    <button {...props} ref={ref} className={styles.root}>
      {children}
    </button>
  );
});
Button.displayName = "Button";
