export interface BlueTickProps {
  recieverId: string;
  ids: string[];
}

export interface doubleTickProps {
  _id: string;
  receiverId: string;
  messageIds: string[];
}

export interface typingProps {
  senderId: string;
  receiverId: string;
}
