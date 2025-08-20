import React from "react";
import clsx from "clsx";
import styles from "./IridescentButton.module.scss";

export type IridescentButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Optional visual density
   * - "md" (default)
   * - "lg"
   */
  size?: "md" | "lg";
  /**
   * Fill style
   * - "solid" (default)
   * - "ghost" (transparent text-only with animated border)
   */
  variant?: "solid" | "ghost";
};

export const IridescentButton: React.FC<IridescentButtonProps> = ({
  className,
  size = "md",
  variant = "solid",
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        styles[`size-${size}`],
        styles[`variant-${variant}`],
        className
      )}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export default IridescentButton;
