import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface JwtUserPayload {
  sub: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUserPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user as JwtUserPayload;
  },
);
