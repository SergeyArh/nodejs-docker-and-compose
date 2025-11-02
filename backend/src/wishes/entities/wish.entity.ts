import { Offer } from 'src/offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

@Entity('wishes')
export class Wish extends BaseEntity {
  @Column()
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column({
    default: 0,
  })
  raised: number;

  @Column({
    length: 1024,
  })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
