import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import api, { Product } from "../../api";
import Layout from "../../components/layout";
import styles from "./dashboard.module.scss";

interface DashboardProps {
  products: Product[];
}

const Dashboard: NextPage<DashboardProps> = ({ products }) => {
  const router = useRouter();

  const numberFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const deleteProductAsync = async (id: number) => {
    try {
      const response = await api.Products.apiProductsIdDelete(id);

      if (response.status == 204) {
        router.reload();
      }
    } catch (err) {}
  };

  return (
    <>
      <Layout>
        <article className={styles.dashboard}>
          <Link href="/products/create">
            <button>
              <a>Adicionar</a>
            </button>
          </Link>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((_, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <strong>{_.id}</strong>
                    </td>
                    <td>{_.name}</td>
                    <td>{_.description}</td>
                    <td>{numberFormatter.format(_.value)}</td>
                    <td>
                      <Link href={`/products/${_.id}`}>
                        <button>
                          <a>Editar</a>
                        </button>
                      </Link>
                      <button onClick={(e) => deleteProductAsync(_.id)}>
                        <span>Remover</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default Dashboard;
export { getServerSideProps };
