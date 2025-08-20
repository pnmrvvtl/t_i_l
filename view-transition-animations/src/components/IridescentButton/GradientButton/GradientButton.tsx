import React from "react";
import styles from "./GradientButton.module.scss";

export type GradientButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  ...rest
}) => {
  return (
    <button className={styles.button} {...rest}>
      <span>{children}</span>
    </button>
  );
};

export default GradientButton;
