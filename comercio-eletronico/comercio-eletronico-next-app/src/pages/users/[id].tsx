import { NextPage } from "next";
import api, { Client } from "../../api";
import Layout from "../../components/layout";
import ClientForm from "../../components/user-form";

interface UserIdProps {
  client: Client;
  id: number;
}

const UsersId: NextPage<UserIdProps> = ({ id, client }) => {
  return (
    <>
      <Layout>
        <ClientForm client={client} />
      </Layout>
    </>
  );
};

const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const parsedId = Number.parseInt(id.toString());

  try {
    const response = await api.Clients.apiClientsIdGet(parsedId);

    return {
      props: {
        id: parsedId,
        client: response.data,
      },
    };
  } catch (err) {
    console.log(err);
  }

  return {
    notFound: true,
  };
};

export default UsersId;
export { getServerSideProps };
