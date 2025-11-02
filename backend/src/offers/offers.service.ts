import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async createOffer(userId: number, data: CreateOfferDto) {
    const { itemId, amount } = data;

    const wish = await this.wishesService.getWishById(itemId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id === userId) {
      throw new NotFoundException('На свой подарок нельзя скидываться');
    }

    if (wish.raised + amount > wish.price) {
      throw new NotFoundException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }

    await this.wishesService.raisedWish(wish.id, amount);

    //TODO - добавить валидацию
    const offer = await this.offerRepository.create({
      ...data,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.offerRepository.save(offer);
    return {};
  }

  async getOffers(userId: number) {
    return await this.offerRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getOfferById(offerId: number) {
    return await this.offerRepository.findOne({
      where: { id: offerId },
    });
  }
}
