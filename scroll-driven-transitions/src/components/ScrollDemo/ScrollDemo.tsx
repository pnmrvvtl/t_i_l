import React from "react";
import styles from "./ScrollDemo.module.scss";

export default function ScrollDemo() {
  const sections = [
    {
      title: "Discover Nature",
      cards: ["Mountains", "Lakes", "Forests"],
    },
    {
      title: "Explore Cities",
      cards: ["Paris", "Tokyo", "New York"],
    },
    {
      title: "Enjoy Life",
      cards: ["Food", "Music", "Friends"],
    },
  ];

  return (
    <div className={styles.page}>
      {sections.map((section, i) => (
        <section key={i} className={styles.section}>
          <div className={styles.sticky}>
            <h2 className={styles.title}>{section.title}</h2>
            <div className={styles.cards}>
              {section.cards.map((c, j) => (
                <div key={j} className={styles.card}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
