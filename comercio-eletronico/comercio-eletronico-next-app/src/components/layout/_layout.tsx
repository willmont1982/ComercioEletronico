import Head from "next/head";
import Content from "../content";
import Nav from "../nav";
import styles from "./_layout.module.scss";

type LayoutProps = {
  children: React.ReactFragment;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <link href="/static/svg/bakery.svg" rel="icon" type="xml+svg" />
        <title>Pão Fino</title>
      </Head>
      <main className={styles.layout}>
        <Nav />
        <Content>
          {children}
        </Content>
      </main>
    </>
  );
};

export default Layout;
