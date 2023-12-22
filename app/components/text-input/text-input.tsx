import React from "react";
import styles from "./styles.module.css";

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  return <input {...props} type="text" ref={ref} className={styles.root} />;
});

TextInput.displayName = "TextInput";
