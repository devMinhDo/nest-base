import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginEmailDto } from './dto/login-email.dto';
import { RegisterDto } from './dto/register.dto';

@ApiBearerAuth()
@ApiTags('TokenAuth')
@Controller('TokenAuth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('Authenticate')
  loginWithEmail(@Body() loginEmailDto: LoginEmailDto, @Res() res: any) {
    return this.authService.loginWithEmail(loginEmailDto, res);
  }
  @HttpCode(200)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
