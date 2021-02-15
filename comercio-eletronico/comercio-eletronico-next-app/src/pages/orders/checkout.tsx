import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import api, { Order, Product } from "../../api";
import Enumerable from "linq";
import CartContext from "../../components/cart";
import Layout from "../../components/layout";
import styles from "./checkout.module.scss";
import { OrderItem, OrderPaymentType } from "../../api/generated";
import TokenContext from "../../components/token";
import { useRouter } from "next/router";

const Checkout = () => {
  const { items, setItems } = useContext(CartContext);
  const { client, decodedToken, token, setClient } = useContext(TokenContext);

  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState(OrderPaymentType.NUMBER_0);

  const router = useRouter();

  useEffect(() => {
    if (!decodedToken) {
      router.push("/users/login");
    }
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const order: Order = {
        client: {
          id: decodedToken.nameid,
        },
        address,
        paymentType,
        items,
      };

      const response = await api.Orders.apiOrdersPost(order, {
        headers: {
          Authorization: `${token.schema} ${token.token}`,
        },
      });

      if (response.status == 201 || 204) {
        setItems([]);

        router.push("/orders")
      }
    } catch (err) {
      console.log(err);
    }
  };

  const numberFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      <Layout>
        <form className={styles.checkout} onSubmit={onSubmit}>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Valor Unitário</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((_, i) => {
                return (
                  <tr key={i}>
                    <td>{_.product.name}</td>
                    <td>{_.count}</td>
                    <td>{_.product.value}</td>
                    <td>{numberFormatter.format(_.product.value * _.count)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td />
                <td>
                  <strong>
                    {numberFormatter.format(
                      Enumerable.from<OrderItem>(items).sum(
                        (_) => _.count * _.product.value
                      )
                    )}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <h1>Pedido</h1>
          <label>Pagamento</label>
          <select
            onChange={(e) => setPaymentType(Number.parseInt(e.target.value))}
            value={paymentType}
          >
            <option value={OrderPaymentType.NUMBER_0}>Dinheiro</option>
            <option value={OrderPaymentType.NUMBER_1}>Cartão de Crédito</option>
          </select>
          <label htmlFor="address">Endereço</label>
          <textarea
            name="address"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
          <button
            type="button"
            onClick={(e) => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const googleMapsAPIUrl = `https://www.google.com/maps/search/?api=1&query=${position.coords.latitude},${position.coords.longitude}`;

                  setAddress(googleMapsAPIUrl);
                  window.open(googleMapsAPIUrl);
                });
              }
            }}
          >
            Usar a localização atual
          </button>
          <button type="submit">Realizar pedido</button>
        </form>
      </Layout>
    </>
  );
};

export default Checkout;
