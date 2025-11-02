import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { FindUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  profile(@Req() req) {
    const user = req.user;
    const { password, ...result } = user;

    return result;
  }

  @UseGuards(JwtGuard)
  @Patch('/me')
  update(@Req() req, @Body() body) {
    const { user } = req;
    return this.usersService.updateUser(user.id, body);
  }

  @UseGuards(JwtGuard)
  @Post('/find')
  findUser(@Body() body: FindUserDto) {
    return this.usersService.findMany(body.query);
  }

  @UseGuards(JwtGuard)
  @Get('/me/wishes')
  getWishes(@Req() req) {
    return this.usersService.getMyWishes(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('/:userName/wishes')
  getWishesByUserName(@Param() params) {
    return this.usersService.getUserWishes(params.userName);
  }

  @UseGuards(JwtGuard)
  @Get('/:userName')
  getUser(@Param() params) {
    return this.usersService.getUser(params.userName);
  }
}
