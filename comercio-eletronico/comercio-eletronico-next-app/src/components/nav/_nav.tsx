import Link from "next/link";
import { Router, withRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CartConsumer } from "../cart";
import TokenContext, { TokenConsumer } from "../token";
import styles from "./_nav.module.scss";

const navItems: NavItemProps[] = [
  {
    content: "Início",
    href: "/",
  },
  {
    content: "Pedidos",
    href: "/orders",
  },
  {
    content: "Dashboard",
    href: "/dashboard",
    onlyAdministradors: true,
  },
];

type NavProps = {
  router: Router;
};

const Nav = ({ router }: NavProps) => {
  return (
    <>
      <nav className={styles.nav}>
        <header className={styles.nav_header}>
          <img src="/static/svg/bakery.svg" />
        </header>
        <ul className={styles.nav_content}>
          {navItems.map((_, i) => (
            <NavItem
              content={_.content}
              href={_.href}
              key={i}
              onlyAdministradors={_.onlyAdministradors}
              router={router}
              target={_.target}
            />
          ))}
        </ul>
        <footer className={styles.nav_footer}>
          <TokenConsumer />
          <CartConsumer />
        </footer>
      </nav>
    </>
  );
};

type NavItemProps = {
  content: string;
  href: string;
  onlyAdministradors?: boolean;
  router?: Router;
  target?: string;
};

const NavItem = ({
  content,
  href,
  onlyAdministradors,
  router,
  target,
}: NavItemProps) => {
  const className =
    router.pathname === href
      ? `${styles.nav_item} ${styles.nav_item__active}`
      : styles.nav_item;

  const { decodedToken } = useContext(TokenContext);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(decodedToken?.role == "Administrator" || !onlyAdministradors);
  }, [decodedToken]);

  if (isVisible) {
    return (
      <>
        <li className={className}>
          <Link href={href}>
            <a target={target}>{content}</a>
          </Link>
        </li>
      </>
    );
  }

  return <></>;
};

export default withRouter(Nav);
