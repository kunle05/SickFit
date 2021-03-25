const { gql } = require('apollo-server');

const typeDefs = gql`
    scalar Date
    enum Permission {
        ADMIN
        USER
        ITEMCREATE
        ITEMUPDATE
        ITEMDELETE
        PERMISSIONUPDATE
    }

    type User {
        id: ID!
        name: String! 
        email: String! 
        permissions: [Permission!]
        cart: [CartItem!]
        createdAt: Date
        updatedAt: Date
    }

    type Item {
        id: ID!
        title: String!
        description: String!
        price: Int!
        image: String
        largeImage: String
        createdAt: Date
        updatedAt: Date
        # user: User!
    }

    type CartItem {
        id: ID!
        quantity: Int!
        item: Item
        user: User!
    }

    type OrderItem {
        id: ID! 
        title: String!
        description: String!
        quantity: Int!
        price: Int!
        image: String!
        largeImage: String!
        createdAt: Date
        updatedAt: Date
        # user User
    }

    type Order {
        id: ID!
        total: Int!
        charge: String!
        items: [OrderItem!]
        user: User!
        createdAt: Date
        updatedAt: Date
    }

    type SuccessMessage {
        message: String
    }

    type Query {
        getAllUsers: [User]!
        me: User
        getAllItems(searchTerm: String, where: ItemFilter, orderBy: ItemOrderBy, skip: Int, take: Int): [Item]
        getItem(id: ID!) : Item
        itemsCount: Int
        order(id: ID!) : Order
        orders: [Order!]
    }

    type Mutation {
        createItem(data: ItemData!) : Item!
        updateItem(data: ItemUpdate!) : Item!
        deleteItem(id: ID!) : Item!
        signup(data: NewUser) : User
        signin(data: UserSignIn) : User
        signout: SuccessMessage
        requestReset(email: String!) : SuccessMessage
        resetPassword(resetToken: String!, password: String!, confirmPassword: String!) : User!
        updatePermissions(permissions: [Permission], userId: ID!) : User!
        addToCart(id: ID!) : CartItem
        removeFromCart(id: ID!) : CartItem
        createOrder(token: String!) : Order!
    }

    input UserData {
        name: String
        email: String
    }
    input ItemData {
        title: String
        price: Int
        description: String
        image: String
        largeImage: String
    }
    input ItemUpdate {
        id: ID!
        title: String
        price: Int
        description: String
    }
    input ItemFilter {
        title: StringFilter 
        description: StringFilter
        price: NumFilter
    }
    input ItemOrderBy {
        title: String
        price: String
        createdAt: String
        updatedAt: String
    }
    input StringFilter {
        contains: String
    }
    input NumFilter {
        lt: Int
        lte: Int
        gt: Int
        gte: Int
    }
    input NewUser {
        name: String!
        email: String!
        password: String!
    }
    input UserSignIn {
        email: String!
        password: String!
    }
`;

module.exports = typeDefs
