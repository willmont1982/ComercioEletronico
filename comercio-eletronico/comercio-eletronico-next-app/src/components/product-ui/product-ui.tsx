import { OrderItem, Product } from "../../api";
import styles from "./product-ui.module.scss";
import { useContext, useEffect, useState } from "react";
import CartContext from "../cart";
import Enumerable from "linq";

type ProductUIProps = {
  data: Product;
};

const ProductUI = ({ data }: ProductUIProps) => {
  const { items, setItems } = useContext(CartContext);
  const [item, setItem] = useState<OrderItem>({ count: 0, product: data });

  useEffect(() => {
    if (items) {
      const orderItem = Enumerable.from<OrderItem>(items)
        .where((item) => item.product.id == data.id)
        .firstOrDefault();

      if (orderItem) {
        setItem(item);
      }
    }
  }, []);

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const otherItems = Enumerable.from<OrderItem>(items)
    .where((item) => item.product.id != data.id)
    .toArray();

  return (
    <>
      <div className={styles.product}>
        <img className={styles.product_cover} src={data.imageBase64} />
        <div className={styles.product_info}>
          <strong>{data.name}</strong>
          <span>{currencyFormatter.format(data.value)}</span>
          <div className={styles.product_actions}>
            <button
              onClick={(e) => {
                item.count++;

                setItems([...otherItems, item]);

                console.log(items);
              }}
            >
              {item.count > 0 ? `${item.count}` : "Adicionar"}
            </button>
            {item.count > 0 ? (
              <button
                onClick={(e) => {
                  setItem({ count: 0, product: data });
                  setItems([...otherItems]);
                }}
              >
                <strong>Limpar</strong>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductUI;
