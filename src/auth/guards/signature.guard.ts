import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { message, domain, types, signature, expectedWallet } = request.body;

    // Validate request body
    this.validateRequestBody({
      message,
      domain,
      types,
      signature,
      expectedWallet,
    });

    const isSignatureValid = this.authenticationService.verifySignature({
      message,
      domain,
      types,
      signature,
      expectedWallet,
    });

    if (!isSignatureValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    const isUserInDatabase =
      await this.authenticationService.isUserInDatabase(expectedWallet);

    if (!isUserInDatabase) {
      throw new UnauthorizedException('User not found in database');
    }

    request['_signatureGuardData'] = { walletAddress: expectedWallet };
    return true;
  }

  // @todo: This should be handled by separate validation module
  private validateRequestBody(body: { [key: string]: any }) {
    const requiredParams = [
      'message',
      'domain',
      'types',
      'signature',
      'expectedWallet',
    ];

    for (const param of requiredParams) {
      if (!body[param]) {
        throw new BadRequestException(`Missing ${param} parameter`);
      }
    }
  }
}
