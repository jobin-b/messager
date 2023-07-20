import { Chatroom } from "./entities.js";
import { AppDataSource } from "./data-source.js";
import { assertAbstractType } from "graphql";

const Chatrooms = AppDataSource.getRepository(Chatroom)

export const createChatroom = async (chatroom: Chatroom) => {
  try {
    await Chatrooms.save(chatroom);
  } catch (err) {
    console.log(err);
  }
}

export const getRecentChatrooms = async (id: number) => {
  try{
    return await Chatrooms.createQueryBuilder("chatroom")
      .where(`chatroom.id = :id`, { id: id })
      .select(["chatroom.id","chatroom.title", "chatroom.numberOfMembers"])
      .getMany();
  } catch (err) {
    console.log('ERROR: CANT FIND RECENT CHATROOMS');
    return null;
  }
}

export const getChatroom = async (id: number) => {
  try{
    return await Chatrooms.createQueryBuilder("chatroom")
      .where(`chatroom.id = :id`, { id: id })
      .getOne();
  } catch (err) {
    console.log('ERROR: CANT FIND CHATROOM');
    return null;
  }
}