import { NextPage } from "next";
import api, { Product } from "../../api";
import Layout from "../../components/layout";
import ProductForm from "../../components/product-form";

interface Props {
  product: Product;
  id: number;
}

const ProductId: NextPage<Props> = ({ id, product }) => {
  console.log(product);

  return (
    <>
      <Layout>
        <ProductForm product={product} />
      </Layout>
    </>
  );
};

const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const parsedId = Number.parseInt(id.toString());

  try {
    const response = await api.Products.apiProductsIdGet(parsedId);

    return {
      props: {
        id: parsedId,
        product: response.data,
      },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    notFound: true,
  };
};

export default ProductId;
export { getServerSideProps };
