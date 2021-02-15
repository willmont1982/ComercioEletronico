import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { Client, JwtSecurityToken } from "../../api";

interface JwtSecurityDecodedToken {
  email?: string;
  exp?: number;
  iat?: number;
  nameid?: number;
  nbf?: number;
  role?: string;
  unique_name?: string;
}

const client: Client = null;
const decodedToken: JwtSecurityDecodedToken = null;
const token: JwtSecurityToken = null;

const TokenContext = createContext({
  client,
  decodedToken,
  token,
  setClient: ({}) => {},
  setDecodedToken: ({}) => {},
  setToken: ({}) => {},
});

type TokenProviderProps = {
  children: React.ReactFragment;
};

const TokenProvider = ({ children }: TokenProviderProps) => {
  const [client, setClient] = useState<Client>();
  const [token, setToken] = useState<JwtSecurityToken>();
  const [decodedToken, setDecodedToken] = useState<JwtSecurityDecodedToken>();

  const value = {
    client,
    decodedToken,
    token,
    setClient,
    setDecodedToken,
    setToken,
  };

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

const TokenConsumer = () => {
  const { decodedToken, token, setDecodedToken, setToken } = useContext(
    TokenContext
  );

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const getTokenFromLocalStorage = () => {
      const json = localStorage.getItem("token");

      if (json && !token) {
        setToken(JSON.parse(json) as JwtSecurityToken);
      }
    };

    getTokenFromLocalStorage();
  }, []);

  useEffect(() => {
    const setTokenToLocalStorage = () => {
      if (token) {
        localStorage.setItem("token", JSON.stringify(token));

        const obj = jwt.decode(token?.token);

        setDecodedToken(obj as JwtSecurityDecodedToken);
      }
    };

    setTokenToLocalStorage();
  }, [token]);

  useEffect(() => {
    if (decodedToken) {
      const groups = /(\w*) (\w.*)/g.exec(decodedToken.unique_name);

      setUserName(groups[1]);
    }
  }, [decodedToken]);

  return (
    <>
      <Link href="/users/login">
        <button>
          <a>{token?.token ? userName : "Login"}</a>
        </button>
      </Link>
    </>
  );
};

export default TokenContext;
export { TokenConsumer, TokenProvider };
