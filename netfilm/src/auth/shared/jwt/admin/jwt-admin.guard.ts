import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAdminGuard extends AuthGuard('admin-strategy') {}