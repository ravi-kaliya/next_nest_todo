// src/auth/auth.service.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailerService: MailerService,

    // Inject User model from Mongoose
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    // Inject Redis client if you set up RedisModule
    @Inject('REDIS_CLIENT') private readonly redisClient: any,
  ) {}

  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999).toString();
    await this.redisClient.set(`otp:${email}`, otp, 'EX', 300); // 5 min expiry

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(email: string, otp: string) {
    const storedOtp = await this.redisClient.get(`otp:${email}`);
    if (storedOtp && storedOtp === otp) {
      await this.redisClient.del(`otp:${email}`);
      return { valid: true };
    }
    return { valid: false };
  }

  async resetPassword(email: string, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await this.userModel.updateOne({ email }, { passwordHash: hash });

    if (result.matchedCount === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'Password updated successfully' };
  }
}
