import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('groups')
export class GroupEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ name: 'created_by' })
  created_by: string;
}
