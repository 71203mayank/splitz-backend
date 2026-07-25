export interface Presence {
    socketId: string;
    userId: string;
    roomId: string;
    userName: string;
}

const presenceStore = new Map<string, Presence>();

export const  addPresence = (presence: Presence) => {
    presenceStore.set(presence.socketId, presence);
}

export const removePresence = (socketId: string) => {
    return presenceStore.delete(socketId);
}

export const getPresence = (socketId: string) => {
    return presenceStore.get(socketId);
}

export const getUsersInRoom = (roomId: string) => {
    return [...presenceStore.values()].filter( (p) => p.roomId == roomId);
}

export {presenceStore};