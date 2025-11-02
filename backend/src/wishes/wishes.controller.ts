import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wishes.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  create(@Req() req, @Body() body: CreateWishDto) {
    return this.wishesService.create(body, req.user.id);
  }

  @Get('/last')
  getLastWishes() {
    return this.wishesService.getLast();
  }

  @Get('/top')
  getTopWishes() {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtGuard)
  @Post('/:id/copy')
  @HttpCode(201)
  copyWish(@Req() req, @Param() params) {
    const wishId = Number(params.id);
    const userId = Number(req.user.id);
    return this.wishesService.copy(userId, wishId);
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  @HttpCode(200)
  updateMyWish(@Req() req, @Param() params, @Body() body) {
    return this.wishesService.updateWish(
      Number(req.user.id),
      Number(params.id),
      body,
    );
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  deleteMyWish(@Req() req, @Param() params) {
    return this.wishesService.deleteWish(
      Number(req.user.id),
      Number(params.id),
    );
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getWish(@Param() params) {
    const wishId = Number(params.id);
    return this.wishesService.getWishById(wishId);
  }
}
