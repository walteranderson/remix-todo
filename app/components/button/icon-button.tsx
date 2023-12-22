import React from "react";
import styles from "./styles.module.css";
import { Icon } from "@iconify/react";

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  React.HTMLProps<HTMLButtonElement> & {
    type: "submit" | "button" | "reset";
    icon: string;
  }
>((props, ref) => {
  return (
    <button {...props} ref={ref} className={styles.icon}>
      <Icon icon={props.icon} />
    </button>
  );
});

IconButton.displayName = "IconButton";
