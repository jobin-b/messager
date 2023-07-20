import { GraphQLScalarType, Kind } from 'graphql';
import {getUser, createUser, loginUser} from './database/userController.js'
import {getRecentChatrooms} from './database/chatroomController.js'
import { PubSub } from 'graphql-subscriptions';


export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # TODO: Add auth for protected requests
  # 
  type User {
    id: ID!
    username: String!
    bio: String
    contacts: [User!]!       # Array of other Users
  }

  # 
  type Message {
    id: ID!
    text: String!
    sender: User!         # User who sent message
    createdAt: String!    # Date in ISO String
    chatroom: ID!         # Chatroom that owns message
    # To Add
    # seenBy
    # deliveredTo
  }

  type ChatroomSummary {
    id: ID!
    title: String!
    numberOfMembers: Int!
  }

  # 
  type Chatroom {
    id: ID!
    title: String!
    numberOfMembers: Int!
    users: [User!]!         # Users in this current Chatroom
    lastActivity: String!   # Date in ISO String
    private: Boolean!
  }

  # TODO: ADD MODIFIERS BELOW
  type Error {
    field: String
    message: String!
  }

  type Query { # TODO: add pagination later
    user(id: ID!): User!
    recentChatrooms(userid: ID!): [ChatroomSummary!]!
    recentMessages(chatroomId: ID!): [Message]
    hello: String!
  }

  input UserInfo {
    username: String!
    password: String!
    bio: String
  }

  input MessageInfo {
    text: String!
    sender: ID!
    chatroom: ID!
  }

  type userResponse {
    user: User
    errors: [Error!]
  }

  # MUTATION = CRUD OPERATIONS involves write then fetch
  type Mutation {
    signup(userInfo: UserInfo!): userResponse
    login(userInfo: UserInfo!): User
    sendMessage(message: MessageInfo!): Boolean!
  }

  type Subscription {
    newMessage: Message!
  }
`;

const NEW_MESSAGE = "NEW MESSAGE"

export const resolvers = {
  Subscription: {
    newMessage: (_, __, {pubsub}) => pubsub.asyncIterator(NEW_MESSAGE)
  },
  Query: {
    user(parent, args, contextValue, info) {
      getUser(args.id);
    },
    recentChatrooms(parent, args, contextValue, info){
      getRecentChatrooms(args.userId);
    },
    hello: () => "hello world"
  },
  Mutation: {
    signup: async (parent, args, contextValue, info) => {
      const user = await createUser(args.userInfo);
      return {
        user: user,
        errors: null
      }
    },
    login: async(parent, args, contextValue, info) => {
      return await loginUser(args.userInfo);
    },
  }
};

const pubsub = new PubSub;