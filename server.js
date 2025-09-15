const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Base de datos en memoria
let actors = [
  { id: '1', name: 'Robert Downey Jr.', movie: 'Iron Man' },
  { id: '2', name: 'Chris Evans', movie: 'Captain America' },
  { id: '3', name: 'Scarlett Johansson', movie: 'Avengers' },
  { id: '4', name: 'Chris Hemsworth', movie: 'Thor' },
  { id: '5', name: 'Mark Ruffalo', movie: 'Avengers' },
  { id: '6', name: 'Tom Holland', movie: 'Spider-Man: Homecoming' },
  { id: '7', name: 'Zendaya', movie: 'Spider-Man: Homecoming' },
  { id: '8', name: 'Robert Downey Jr.', movie: 'Avengers' }, // actor con más de una película
  { id: '9', name: 'Benedict Cumberbatch', movie: 'Doctor Strange' },
  { id: '10', name: 'Chadwick Boseman', movie: 'Black Panther' },
];

// Definición del esquema GraphQL
const typeDefs = gql`
  type Actor {
    id: ID!
    name: String!
    movie: String!
  }

  type Query {
    actors: [Actor!]!
    actor(id: ID!): Actor
    actorsByMovie(movie: String!): [Actor!]!
  }

  type Mutation {
    addActor(name: String!, movie: String!): Actor!
    updateActor(id: ID!, name: String, movie: String): Actor
    deleteActor(id: ID!): Boolean
  }
`;

// Resolver
const resolvers = {
  Query: {
    actors: () => actors,
    actor: (_, { id }) => actors.find(a => a.id === id),
    actorsByMovie: (_, { movie }) => actors.filter(a => a.movie === movie),
  },
  Mutation: {
    addActor: (_, { name, movie }) => {
      const newActor = { id: String(actors.length + 1), name, movie };
      actors.push(newActor);
      return newActor;
    },
    updateActor: (_, { id, name, movie }) => {
      const actor = actors.find(a => a.id === id);
      if (!actor) return null;
      if (name !== undefined) actor.name = name;
      if (movie !== undefined) actor.movie = movie;
      return actor;
    },
    deleteActor: (_, { id }) => {
      const index = actors.findIndex(a => a.id === id);
      if (index === -1) return false;
      actors.splice(index, 1);
      return true;
    },
  },
};

// Crear servidor Apollo
async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: 4000 }, () =>
    console.log(`Servidor corriendo en http://localhost:4000/graphql`)
  );
}

startServer();
