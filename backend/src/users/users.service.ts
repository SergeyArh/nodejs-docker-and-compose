import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
    private wishesService: WishesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const saltValue = this.configService.get<string>('SALT')!;

    const hashedPassword = await bcrypt.hash(password, Number(saltValue));

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async updateUser(id: number, data: Partial<CreateUserDto>) {
    const { password, ...rest } = data;
    if (!password) {
      await this.usersRepository.update(id, data);
    } else {
      const saltValue = this.configService.get<string>('SALT')!;
      const hashedPassword = await bcrypt.hash(password, Number(saltValue));
      await this.usersRepository.update(id, {
        password: hashedPassword,
        ...rest,
      });
    }
    return this.usersRepository.findOneBy({ id });
  }

  async findMany(query: string) {
    return this.usersRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
      ],
    });
  }

  async getMyWishes(id: number) {
    return this.wishesService.findMyWishes(id);
  }

  async getUserWishes(userName: string) {
    const user = await this.usersRepository.findOne({
      where: { username: userName },
    });
    if (!user) {
      throw new Error("User don't find");
    }
    return this.wishesService.getUserNameWishes(user.id);
  }

  async getUser(userName: string) {
    const user = await this.usersRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}
