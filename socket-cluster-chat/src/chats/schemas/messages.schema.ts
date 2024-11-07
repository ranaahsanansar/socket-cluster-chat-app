import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ type: String })
  content: string;

  @Prop({ type: String })
  senderName: string;

  @Prop({ type: String })
  room: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
