import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUserDto';
import bcrypt from 'bcrypt';

type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

type ReturnTypes =
  | User
  | {
      id: number; // Assuming there's an 'id' property
      username: string;
      email: string;
    }
  | null;

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number) {
    return await this.prismaService.user.findUnique({ where: { id } });
  }

  async findByUserName({
    username,
    sensitiveIncluded = false,
  }: {
    username: string;
    sensitiveIncluded?: boolean;
  }): Promise<ReturnTypes> {
    const user = await this.prismaService.user.findUnique({
      where: { username: username },
    });
    if (!user) return null;
    if (!sensitiveIncluded) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const genSalt = 12;
    try {
      const hashedPassword = await bcrypt.hash(password, genSalt);

      return await this.prismaService.user.create({
        data: { ...createUserDto, password: hashedPassword },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return this.prismaService.user.findMany({ where: {} });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
