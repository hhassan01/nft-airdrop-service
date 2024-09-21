import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthService } from '../auth/auth.service';
import { MoralisService } from '../moralis/moralis.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, AuthService, MoralisService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
