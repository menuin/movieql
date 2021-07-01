import { GraphQLServer } from "graphql-yoga";
const resolvers = require("./graphql/resolvers");

const server = new GraphQLServer( {
    typeDefs : "./graphql/schema.graphql",
    resolvers
});

server.start(() => console.log("Graphql server running"));