import { User } from "./entities.js";
import { AppDataSource } from "./data-source.js";
import { assertAbstractType } from "graphql";
import argon2 from "argon2";

const Users = AppDataSource.getRepository(User)

export const createUser = async (user) => {
  let newUser = new User();
  newUser.username = user.username;
  newUser.hashedpassword = await argon2.hash(user.password);
  if(user.bio != null) newUser.bio = user.bio;

  await Users.save(newUser);
  return newUser;
}

export const loginUser = async (userInfo) => {
  const user = await Users.findOneBy({username: userInfo.username});

  if(!user) return null;
  const valid = await argon2.verify(user.hashedpassword, userInfo.password)

  if(!valid) {
    return null;
  } 

  return user;
}

export const getUser = async (id: number) => {
  try{
    return await Users.createQueryBuilder("user")
      .where("user.id = :id", { id: id })
      .select(["user.id", "user.username"])
      .getOne();
  } catch (err) {
    console.log('ERROR: CANT FIND USER');
    return null;
  }
}