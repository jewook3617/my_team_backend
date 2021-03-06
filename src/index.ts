import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import mikroConfig from "./mikroOrm.config";
import UserResolver from "./resolvers/user";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  // await orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("Hello world");
  });
  app.listen(4001, () => {
    console.log("server started on localhost:4001");
  });
};

main().catch((e) => console.log(e));
