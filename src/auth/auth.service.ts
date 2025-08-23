import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { generateToken } from 'src/common/csrf.config';
import type { Request } from 'express';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  getAuth(req: Request) {
    return { user: req.session.user };
  }

  getCsrf(req: Request) {
    const token = generateToken(req);
    return { token: token };
  }

  async login(req: Request, loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email and cast to UserDocument
    const user = (await this.userModel.findOne({ email })) as UserDocument;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate password
    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // Save minimal user data in session
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return { message: 'User logged in successfully' };
  }

  async register(request: Request, registerDto: RegisterDto) {
    const { first_name, last_name, email, password } = registerDto;

    const user = await this.userModel.findOne({ email });

    if (user) throw new ConflictException('User already exist');

    const dbNewUser = new this.userModel({
      first_name,
      last_name,
      email,
    });

    await dbNewUser.setPassword(password);
    await dbNewUser.save();

    request.session.user = {
      id: dbNewUser._id.toString(),
      first_name: dbNewUser.first_name,
      last_name: dbNewUser.last_name,
      email: dbNewUser.email,
    };

    return { message: 'User created successfully' };
  }
}
