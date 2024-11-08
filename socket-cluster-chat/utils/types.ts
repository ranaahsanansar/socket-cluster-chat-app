export interface UserPayload {
  preferred_username: string;
}

export interface GroupInfoResponse {
  name: string;
  created_by: string;
}

export interface MessageSocketResponse {
  content: string;
  roomId?: string;
  username: string;
}
