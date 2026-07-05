import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() request: { user: { sub: string } }) {
    return this.usersService.findById(request.user.sub);
  }

  @Get('me/listings')
  myListings(@Req() request: { user: { sub: string } }) {
    return this.usersService.myListings(request.user.sub);
  }

  @Patch('me')
  updateMe(@Req() request: { user: { sub: string } }, @Body() dto: UpdateUserDto) {
    return this.usersService.update(request.user.sub, dto);
  }
}
