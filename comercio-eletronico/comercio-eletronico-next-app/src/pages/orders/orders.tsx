import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import api, { Order, OrderItem } from "../../api";
import Layout from "../../components/layout";
import TokenContext from "../../components/token";
import styles from "./orders.module.scss";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>();
  const { token, decodedToken } = useContext(TokenContext);

  const router = useRouter();

  useEffect(() => {
    const getOrders = async () => {
      if (token) {
        try {
          const response = await api.Orders.apiOrdersGet({
            headers: { Authorization: `${token.schema} ${token.token}` },
          });

          if (response.status == 200) {
            setOrders(response.data);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getOrders();
  }, []);

  const numberFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const getAdmHeaders = () => {
    if (decodedToken?.role == "Administrator") {
      return (
        <>
          <th>Cliente</th>
          <th>Endereço</th>
        </>
      );
    }
  };

  const getAdmRow = (order: Order) => {
    if (decodedToken?.role == "Administrator") {
      return (
        <>
          <td>{order.client.name}</td>
          <td>{order.address}</td>
        </>
      );
    }
  };

  const getAction = (order: Order) => {
    if (decodedToken?.role == "Administrator") {
      return (
        <>
          <button
            onClick={async (e) => {
              try {
                const response = await api.Orders.apiOrdersIdPut(order.id, {
                  ...order,
                  isConfirmed: true,
                });

                if (response.status == 201 || 204) {
                  router.push("/")
                }
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {order.isConfirmed ? "Confirmado" : "Confirmar pedido"}
          </button>
        </>
      );
    }

    return (
      <>
        <button
          onClick={async (e) => {
            try {
              router.push("/")
            } catch (err) {
              console.log(err);
            }
          }}
        >
          {order.isConfirmed ? "Confirmado" : "Verificar status"}
        </button>
      </>
    );
  };

  return (
    <Layout>
      <article className={styles.orders}>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              {getAdmHeaders()}
              <th>Produtos</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((_) => {
              return (
                <tr key={_.id}>
                  <td>
                    <strong>{_.id}</strong>
                  </td>
                  {getAdmRow(_)}
                  <td>
                    <ul>
                      {_.items.map((_) => {
                        return (
                          <li key={_.id}>
                            <span>{`${_.count} x ${_.product.name}`}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td>{numberFormatter.format(_.total)}</td>
                  <td>{getAction(_)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </article>
    </Layout>
  );
};

export default Orders;
