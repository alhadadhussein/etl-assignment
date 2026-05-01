import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const tenantId = process.env.ENTRA_TENANT_ID;
    const clientId = process.env.ENTRA_CLIENT_ID;

    if (!tenantId || !clientId) {
      throw new Error('ENTRA_TENANT_ID and ENTRA_CLIENT_ID must be set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
      }),
      issuer: `https://login.microsoftonline.com/${tenantId}/v2.0`,
      audience: clientId,
      algorithms: ['RS256'],
    });
  }
  
  // Called after token verification; return value becomes req.user
  validate(payload: Record<string, unknown>) {
    return { userId: payload.oid };
  }
}
