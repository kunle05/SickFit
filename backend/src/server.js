const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { PrismaClient } = require("@prisma/client");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const typeDefs = require("./schema");
const Query = require("./resolvers/query");
const Mutation = require("./resolvers/mutation");

const prisma = new PrismaClient();
const app = express();
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
}));

app.use((req, res, next) => {
    const { token } = req.cookies;
    if(token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId;
    }
    next();
});

const server = new ApolloServer({
    typeDefs,
    resolvers : {
        Query,
        Mutation
    }, 
    context: ( req ) => ({ ...req, prisma })
}) 
server.applyMiddleware({ app, path: '/', cors: false });

app.listen(4000, ()=> console.log("server running on port 4000"));

// server.listen(4000, ()=> console.log("server running on port 4000"))


//vid 12 - 14:10

//TODO use cors to restrict
//TODO Use express middleqare to handle cookies (JWT)
//TODO Use express middleware to populate current user