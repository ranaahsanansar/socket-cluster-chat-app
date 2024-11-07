import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from './messages.schema';

@Schema()
export class Room extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: [Message], default: [] })
  messages: Message[];

  @Prop({ type: String })
  roomId: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
