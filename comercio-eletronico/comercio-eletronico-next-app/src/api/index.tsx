import { Configuration } from "./generated";
import {
  AuthApi,
  Client,
  ClientsApi,
  JwtSecurityToken,
  Order,
  OrderItem,
  OrdersApi,
  Product,
  ProductsApi,
} from "./generated/api";

const configuration: Configuration = {
  basePath: "https://localhost:5001",
};

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const args = [configuration];

export default {
  Auth: new AuthApi(...args),
  Clients: new ClientsApi(...args),
  Orders: new OrdersApi(...args),
  Products: new ProductsApi(...args),
};
export type { Client, JwtSecurityToken, Order, OrderItem, Product };
