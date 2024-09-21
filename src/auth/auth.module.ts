import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignatureGuard } from './guards/signature.guard';
import { UserModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  providers: [AuthService, SignatureGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
