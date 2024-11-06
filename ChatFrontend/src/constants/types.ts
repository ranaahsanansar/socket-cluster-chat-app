export type GroupCardResponse = { name: 'new22'; group_id: number; is_delete_able: boolean };

export type GroupInfo = {
  name: string;
  created_by: string;
};

export type MessageType = { content: string; roomId?: string; username: string };
