import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishListsDto } from './dto/create-wishlists.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(data: CreateWishListsDto, userId: number) {
    const { itemsId } = data;
    const items = itemsId.map((id) => ({ id }));

    const wishlist = this.wishlistsRepository.create({
      ...data,
      owner: { id: userId },
      items,
    });

    await this.wishlistsRepository.save(wishlist);

    return this.wishlistsRepository.findOne({
      where: { id: wishlist.id },
      relations: ['owner', 'items'],
    });
  }

  async getWishlists(userId: number) {
    return await this.wishlistsRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'items'],
    });
  }

  async getWishlistsById(wishlistId: number) {
    return await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: ['owner', 'items'],
    });
  }

  async deleteWishlistsById(wishlistId: number) {
    return await this.wishlistsRepository.delete({ id: wishlistId });
  }

  async updateWishlistsById(
    data: CreateWishListsDto,
    userId: number,
    wishlistId: number,
  ) {
    const wishlist = await this.getWishlistsById(wishlistId);

    if (!wishlist || wishlist?.owner?.id !== userId) {
      throw new NotFoundException('Список подарков не найден');
    }

    return this.wishlistsRepository.update({ id: wishlistId }, data);
  }
}
