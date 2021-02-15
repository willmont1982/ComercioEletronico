import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";

const Orders = () => {
  useEffect(() => {
    const createHubConnection = async () => {
      const hubConnection = new HubConnectionBuilder()
        .withUrl("https://localhost:5001/orders")
        .build();

      try {
        await hubConnection.start();
      } catch (err) {
        console.log(err);
      }
    };

    createHubConnection();
  }, []);

  return (
    <>
      <Layout>
        <button>
          <span>Teste</span>
        </button>
      </Layout>
    </>
  );
};

export default Orders;
