export interface BlueTickProps {
  recieverId: string;
  ids: string[];
}

export interface doubleTickProps {
  _id: string;
  recieverId: string;
  messageIds: string[];
}

export interface typingProps {
  senderId: string;
  recieverId: string;
}
