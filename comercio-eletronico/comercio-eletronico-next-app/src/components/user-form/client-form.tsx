import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import MD5 from "crypto-js/md5";
import api, { Client } from "../../api";
import styles from "./client-form.module.scss";
import { ClientRole } from "../../api/generated";

type ClientFormProps = {
  client?: Client;
};

const ClientForm = ({ client }: ClientFormProps) => {
  const [id, setId] = useState(client?.id ?? 0);
  const [email, setEmail] = useState(client?.email ?? "");
  const [name, setName] = useState(client?.name ?? "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const [imageBase64, setImageBase64] = useState(client?.imageBase64 ?? "");

  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const client: Client = {
        id,
        name,
        email,
        password: MD5(`${email}${password}`).toString(),
        phone,
        role: ClientRole.NUMBER_1,
        imageBase64,
      };

      const response =
        id > 0
          ? await api.Clients.apiClientsIdPut(id, client)
          : await api.Clients.apiClientsPost(client);

      if (response.status == 201 || 204) {
        router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.users_form}>
        <form onSubmit={onSubmit}>
          <h1>Cliente</h1>
          {imageBase64 ? <img src={imageBase64} /> : null}
          <label htmlFor="name">Nome</label>
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Carlos Daniel Vieira Pinho"
            value={name}
          />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="carlos@exemplo.com.br"
            type="email"
            value={email}
          />
          <label htmlFor="password">Senha</label>
          <input
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456789"
            type="password"
            value={password}
          />
          <label htmlFor="phone">Telefone</label>
          <input
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+55 65 91234-5678"
            type="phone"
            value={phone}
          />
          <label htmlFor="file">Perfil</label>
          <input
            name="file"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.readAsDataURL(file);

              reader.onload = () => setImageBase64(reader.result.toString());
            }}
            type="file"
          />
          <button type="submit">{`${
            client == null ? "Salvar" : "Atualizar"
          }`}</button>
        </form>
      </div>
    </>
  );
};

export default ClientForm;
