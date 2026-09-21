const express = require('express');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

// Base de datos en memoria ampliada (mismo formato plano)
let actors = [
  { id: '1', name: 'Robert Downey Jr.', movie: 'Iron Man', year: 2008, genre: 'Acción', director: 'Jon Favreau' },
  { id: '2', name: 'Chris Evans', movie: 'Captain America', year: 2011, genre: 'Acción', director: 'Joe Johnston' },
  { id: '3', name: 'Scarlett Johansson', movie: 'Avengers', year: 2012, genre: 'Acción', director: 'Joss Whedon' },
  { id: '4', name: 'Chris Hemsworth', movie: 'Thor', year: 2011, genre: 'Fantasía', director: 'Kenneth Branagh' },
  { id: '5', name: 'Mark Ruffalo', movie: 'Avengers', year: 2012, genre: 'Acción', director: 'Joss Whedon' },
  { id: '6', name: 'Tom Holland', movie: 'Spider-Man: Homecoming', year: 2017, genre: 'Aventura', director: 'Jon Watts' },
  { id: '7', name: 'Zendaya', movie: 'Spider-Man: Homecoming', year: 2017, genre: 'Aventura', director: 'Jon Watts' },
  { id: '8', name: 'Robert Downey Jr.', movie: 'Avengers', year: 2012, genre: 'Acción', director: 'Joss Whedon' },
  { id: '9', name: 'Benedict Cumberbatch', movie: 'Doctor Strange', year: 2016, genre: 'Fantasía', director: 'Scott Derrickson' },
  { id: '10', name: 'Chadwick Boseman', movie: 'Black Panther', year: 2018, genre: 'Acción', director: 'Ryan Coogler' },
  { id: '11', name: 'Tom Holland', movie: 'Spider-Man: Far From Home', year: 2019, genre: 'Acción', director: 'Jon Watts' },
  { id: '12', name: 'Zendaya', movie: 'Spider-Man: Far From Home', year: 2019, genre: 'Acción', director: 'Jon Watts' },
  { id: '13', name: 'Mark Ruffalo', movie: 'Spotlight', year: 2015, genre: 'Drama', director: 'Tom McCarthy' },
  { id: '14', name: 'Scarlett Johansson', movie: 'Marriage Story', year: 2019, genre: 'Drama', director: 'Noah Baumbach' },
  { id: '15', name: 'Robert Downey Jr.', movie: 'Oppenheimer', year: 2023, genre: 'Drama', director: 'Christopher Nolan' },
  { id: '16', name: 'Florence Pugh', movie: 'Oppenheimer', year: 2023, genre: 'Drama', director: 'Christopher Nolan' },
  { id: '17', name: 'Florence Pugh', movie: 'Black Widow', year: 2021, genre: 'Acción', director: 'Cate Shortland' },
  { id: '18', name: 'Scarlett Johansson', movie: 'Black Widow', year: 2021, genre: 'Acción', director: 'Cate Shortland' },
  { id: '19', name: 'Chris Hemsworth', movie: 'Extraction', year: 2020, genre: 'Acción', director: 'Sam Hargrave' },
  { id: '20', name: 'Christian Bale', movie: 'The Dark Knight', year: 2008, genre: 'Acción', director: 'Christopher Nolan' },
  { id: '21', name: 'Heath Ledger', movie: 'The Dark Knight', year: 2008, genre: 'Acción', director: 'Christopher Nolan' },
  { id: '22', name: 'Christian Bale', movie: 'Thor: Love and Thunder', year: 2022, genre: 'Fantasía', director: 'Taika Waititi' },
  { id: '23', name: 'Chris Hemsworth', movie: 'Thor: Love and Thunder', year: 2022, genre: 'Fantasía', director: 'Taika Waititi' },
  { id: '24', name: 'Natalie Portman', movie: 'Thor: Love and Thunder', year: 2022, genre: 'Fantasía', director: 'Taika Waititi' },
  { id: '25', name: 'Keanu Reeves', movie: 'The Matrix', year: 1999, genre: 'Ciencia Ficción', director: 'Lana y Lilly Wachowski' },
  { id: '26', name: 'Laurence Fishburne', movie: 'The Matrix', year: 1999, genre: 'Ciencia Ficción', director: 'Lana y Lilly Wachowski' },
  { id: '27', name: 'Keanu Reeves', movie: 'John Wick', year: 2014, genre: 'Acción', director: 'Chad Stahelski' },
  { id: '28', name: 'Zendaya', movie: 'Dune', year: 2021, genre: 'Ciencia Ficción', director: 'Denis Villeneuve' },
  { id: '29', name: 'Timothée Chalamet', movie: 'Dune', year: 2021, genre: 'Ciencia Ficción', director: 'Denis Villeneuve' },
  { id: '30', name: 'Timothée Chalamet', movie: 'Wonka', year: 2023, genre: 'Fantasía', director: 'Paul King' }
];

let nextId = 31;

// A continuacion definimos esquema GraphQL y resolvers para manejar 
// las consultas y mutaciones relacionadas con los actores. 
// Lo idea es que esten en archivos separados, mejor modularizados, 
// pero para simplificar el ejemplo los dejamos en el mismo archivo.

// Definición del esquema GraphQL
const typeDefs = `#graphql
  type Actor {
    id: ID!
    name: String!
    movie: String!
    year: Int!
    genre: String!
    director: String!
  }

  type Query {
    actors: [Actor!]!
    actor(id: ID!): Actor
    actorsByMovie(movie: String!): [Actor!]!
    actorsByGenre(genre: String!): [Actor!]!
    actorsByDirector(director: String!): [Actor!]!
  }

  type Mutation {
    addActor(name: String!, movie: String!, year: Int!, genre: String!, director: String!): Actor!
    updateActor(id: ID!, name: String, movie: String, year: Int, genre: String, director: String): Actor
    deleteActor(id: ID!): Boolean
  }
`;

// Resolvers
const resolvers = {
  Query: {
    actors: () => actors,

    actor: (_, { id }) =>
      actors.find(a => a.id === id),

    actorsByMovie: (_, { movie }) =>
      actors.filter(a => a.movie.toLowerCase().includes(movie.toLowerCase())),

    actorsByGenre: (_, { genre }) =>
      actors.filter(a => a.genre.toLowerCase() === genre.toLowerCase()),

    actorsByDirector: (_, { director }) =>
      actors.filter(a => a.director.toLowerCase().includes(director.toLowerCase()))
  },

  Mutation: {
    addActor: (_, { name, movie, year, genre, director }) => {
      const newActor = {
        id: String(nextId++),
        name,
        movie,
        year,
        genre,
        director
      };

      actors.push(newActor);

      return newActor;
    },

    updateActor: (_, { id, name, movie, year, genre, director }) => {
      const actor = actors.find(a => a.id === id);

      if (!actor) return null;

      if (name !== undefined) actor.name = name;
      if (movie !== undefined) actor.movie = movie;
      if (year !== undefined) actor.year = year;
      if (genre !== undefined) actor.genre = genre;
      if (director !== undefined) actor.director = director;

      return actor;
    },

    deleteActor: (_, { id }) => {
      const index = actors.findIndex(a => a.id === id);

      if (index === -1) return false;

      actors.splice(index, 1);

      return true;
    }
  }
};


// Crear servidor
async function startServer() {

  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server)
  );

  app.listen(3000, () => {
    console.log(
      'Servidor corriendo en http://localhost:3000/graphql'
    );
  });
}

startServer();