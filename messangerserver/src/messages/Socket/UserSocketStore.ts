class UserSocketStore {
  private UsetIdToSocketId = new Map<string, string>();
  private SocketIdToUserId = new Map<string, string>();

  addUser(userId: string, socketId: string) {
    this.UsetIdToSocketId.set(userId, socketId);
    this.SocketIdToUserId.set(socketId, userId);
  }

  getSocketId(userId: string) {
    if (!userId) throw new Error("Please provide user id.");
    return this.UsetIdToSocketId.get(userId);
  }

  getUserId(socketId: string) {
    if (!socketId) throw new Error("Please provide socket id.");
    return this.SocketIdToUserId.get(socketId);
  }

  removeUser(socketId: string) {
    const userId = this.getUserId(socketId);
    this.SocketIdToUserId.delete(socketId);
    if (userId) {
      this.UsetIdToSocketId.delete(userId);
    }
  }
}

export const UserSocketStoreInstance = new UserSocketStore();
