import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { OrderItem } from "../../api";

const CartContext = createContext({
  items: new Array<OrderItem>(),
  setItems: ([]) => {},
});

type CartProviderProps = {
  children: React.ReactFragment;
};

const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<OrderItem[]>([]);

  const value = { items, setItems };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const CartConsumer = () => {
  const { items } = useContext(CartContext);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((a, b) => a + b.count * b.product.value, 0));
  }, [items]);

  const numberFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      <Link href="/orders/checkout">
        <button>
          <a>{numberFormatter.format(total)}</a>
        </button>
      </Link>
    </>
  );
};

export default CartContext;
export { CartConsumer, CartProvider };
