import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../users/users.service';
import { SignatureGuard } from './guards/signature.guard';
import { User } from '../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUserService = {
    getUserByWalletAddress: jest.fn(),
  };

  const mockUser: User = {
    id: 'some-uuid',
    userName: 'Test User',
    email: 'test@example.com',
    walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    points: 0,
    isOg: false,
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        SignatureGuard,
        Reflector,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('authorizeSignature', () => {
    it('should return a user if signature is valid and user is found', async () => {
      mockUserService.getUserByWalletAddress.mockResolvedValue(mockUser);

      const request = {
        _signatureGuardData: {
          walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        },
      } as any;

      const result = await authController.authorizeSignature(request);
      expect(result).toEqual(mockUser);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      mockUserService.getUserByWalletAddress.mockResolvedValue(null);

      const request = {
        _signatureGuardData: {
          walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        },
      } as any;

      await expect(authController.authorizeSignature(request)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
