import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishListsDto } from './dto/create-wishlists.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  create(@Req() req, @Body() body: CreateWishListsDto) {
    return this.wishlistsService.create(body, Number(req.user.id));
  }

  @UseGuards(JwtGuard)
  @Get('/')
  getWishlists(@Req() req) {
    return this.wishlistsService.getWishlists(Number(req.user.id));
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getWishlisstById(@Req() req, @Param() params) {
    return this.wishlistsService.getWishlistsById(Number(params.id));
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  delete(@Req() req, @Param() params) {
    return this.wishlistsService.deleteWishlistsById(Number(params.id));
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  update(@Req() req, @Body() body, @Param() params) {
    return this.wishlistsService.updateWishlistsById(
      body,
      req.user.id,
      Number(params.id),
    );
  }
}
