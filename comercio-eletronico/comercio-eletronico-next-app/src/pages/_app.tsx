import { AppProps } from "next/app";
import { CartProvider } from "../components/cart";
import { TokenProvider } from "../components/token";
import "../styles/globals.scss";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <TokenProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </TokenProvider>
  );
};

export default App;
