import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('wishlists')
export class Wishlist extends BaseEntity {
  @Column()
  name: string;

  @Column({
    length: 1500,
    default: 'Мой список',
  })
  description: string;

  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
