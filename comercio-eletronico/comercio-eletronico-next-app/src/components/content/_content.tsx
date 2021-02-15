import { Children } from "react";
import styles from "./_content.module.scss";

type ContentProps = {
  children: React.ReactFragment;
};

const Content = ({ children }: ContentProps) => {
  return (
    <>
      <div className={styles.content}>{children}</div>
    </>
  );
};

export default Content;
