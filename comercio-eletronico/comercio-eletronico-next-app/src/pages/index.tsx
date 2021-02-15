import { NextPage } from "next";
import api, { Product } from "../api";
import { CartProvider } from "../components/cart/cart";
import Layout from "../components/layout";
import ProductUI from "../components/product-ui";
import styles from "./index.module.scss";

interface IndexProps {
  products: Product[];
}

const Index: NextPage<IndexProps> = ({ products }) => {
  return (
    <>
      <Layout>
        <article className={styles.index}>
          <ul className={styles.index_container}>
            {products.map((_, i) => {
              return (
                <li key={i}>
                  <ProductUI data={_} />
                </li>
              );
            })}
          </ul>
        </article>
      </Layout>
    </>
  );
};

const getServerSideProps = async () => {
  try {
    const response = await api.Products.apiProductsGet();

    if (response.status == 200) {
      return {
        props: {
          products: response.data,
        },
      };
    }
  } catch (err) {
    console.log(err);
  }

  return {
    notFound: true,
  };
};

export default Index;
export { getServerSideProps };
