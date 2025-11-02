import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('offers')
export class Offer extends BaseEntity {
  @Column()
  amount: number;

  @Column({
    default: false,
  })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
