import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from "typeorm"


@Entity()
@Unique(["username"]) // username is a unique value
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  hashedpassword: string

  @Column({ nullable: true })
  bio: string
}

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  numberOfMembers: number;

  @Column({ default: false })
  private: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

//   @OneToMany(() => Message, message => message.chatroom)
//   messages: Message[];
}