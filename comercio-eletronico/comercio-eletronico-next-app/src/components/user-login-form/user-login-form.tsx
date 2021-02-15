import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import MD5 from "crypto-js/md5";
import api, { Client } from "../../api";
import TokenContext from "../token/token";
import styles from "./user-login-form.module.scss";
import { useRouter } from "next/router";

const UserLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useContext(TokenContext);
  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const client: Client = {
        email,
        password: MD5(`${email}${password}`).toString(),
      };

      const response = await api.Auth.apiAuthTokenPost(client);

      if (response.status == 200) {
        setToken(response.data);

        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.user_login_form}>
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="carlos@exemplo.com.br"
            type="email"
          />
          <label htmlFor="password">Senha</label>
          <input
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456789"
            type="password"
          />
          <Link href="/users/create">
            <a>Criar conta</a>
          </Link>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </>
  );
};

export default UserLoginForm;
