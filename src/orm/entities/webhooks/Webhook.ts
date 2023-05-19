import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'convoy_id' })
  convoyId: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'scopes' })
  scopes: string;

  @Column({ name: 'created' })
  @CreateDateColumn()
  created: Date | null = null;

  @Column({ name: 'updated' })
  @UpdateDateColumn()
  updated: Date | null = null;
}
