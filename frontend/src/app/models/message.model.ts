export interface Message {
  _id: string,
  userId: string,
  username: string,
  message: string
}

export class MessageClass {
  constructor(
    public _id: string,
    public userId: string,
    public username: string,
    public message: string
  ) {
  }

}

export interface ServerMessage {
  type: string,
  message: Message,
}
