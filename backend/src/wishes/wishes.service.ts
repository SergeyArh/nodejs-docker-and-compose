import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wishes.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(data: CreateWishDto, ownerId: number) {
    const savedWish = await this.wishesRepository.save({
      ...data,
      owner: { id: ownerId },
    });

    const wish = await this.wishesRepository.findOne({
      where: { id: savedWish.id },
      relations: ['owner'],
    });

    return wish;
  }

  async findMyWishes(userId: number) {
    return this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });
  }

  async getWishById(wishId: number) {
    if (isNaN(wishId)) {
      throw new Error('wishId is not a number');
    }
    return this.wishesRepository.findOne({
      where: { id: wishId },
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });
  }

  async getUserNameWishes(userId: number) {
    return this.wishesRepository.find({
      where: { owner: { id: userId } },
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
    });
  }

  async getLast() {
    return this.wishesRepository.find({
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async getTop() {
    return this.wishesRepository.find({
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
        'offers.user.wishlists.owner',
        'offers.user.wishlists.items',
      ],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async updateWish(
    userId: number,
    wishId: number,
    data: Partial<CreateWishDto>,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { owner: { id: userId }, id: wishId },
      relations: [
        'owner',
        'offers.user',
        'offers.user.offers',
        'offers.user.wishes',
        'offers.user.wishlists',
      ],
    });
    if (!wish) {
      throw new NotFoundException(
        'Подарок не найден или не принадлежит пользователю',
      );
    }
    await this.wishesRepository.update(wishId, data);
  }

  async deleteWish(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { owner: { id: userId }, id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException(
        'Подарок не найден или не принадлежит пользователю',
      );
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async copy(userId: number, wishId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    const newWish = this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: userId },
      copied: 0,
      raised: 0,
    });

    await this.wishesRepository.save(newWish);

    wish.copied += 1;
    const savedNEwWish = await this.wishesRepository.save(wish);

    return this.wishesRepository.findOne({
      where: { id: savedNEwWish.id },
      relations: ['owner'],
    });
  }

  async raisedWish(wishId: number, amount: number) {
    await this.wishesRepository.increment({ id: wishId }, 'raised', amount);
  }
}
