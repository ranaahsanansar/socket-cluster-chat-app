import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GroupEntity } from './group.entity';

@Entity('group-members')
export class GroupMembersEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => GroupEntity, (group) => group.id)
  @JoinColumn({ name: 'group_id' })
  groupId: GroupEntity;
}
