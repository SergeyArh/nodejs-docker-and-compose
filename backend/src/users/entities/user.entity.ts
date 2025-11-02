import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
