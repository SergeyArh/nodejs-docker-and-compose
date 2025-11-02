import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { type CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('offers')
export class OffersController {
  constructor(private offerService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  create(@Req() req, @Body() body: CreateOfferDto) {
    return this.offerService.createOffer(Number(req.user.id), body);
  }

  @UseGuards(JwtGuard)
  @Get('/')
  getOffer(@Req() req) {
    return this.offerService.getOffers(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getOfferByID(@Req() req, offerId: number) {
    return this.offerService.getOfferById(offerId);
  }
}
