import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post()
    Login(@Body() user:{email:string,password:string}){
        // this.authService.login(user.email,user.password);
        // return { message: 'Login endpoint hit' };
    }
}
