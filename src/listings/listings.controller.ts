import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { SearchListingsDto } from './dto/search-listings.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Req() request: { user: { sub: string } }, @Body() dto: CreateListingDto) {
    return this.listingsService.create(request.user.sub, dto);
  }

  @Public()
  @Get()
  search(@Query() query: SearchListingsDto) {
    return this.listingsService.search(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() request: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(request.user.sub, id, dto);
  }

  @Patch(':id/sold')
  markSold(@Req() request: { user: { sub: string } }, @Param('id') id: string) {
    return this.listingsService.markSold(request.user.sub, id);
  }

  @Delete(':id')
  remove(@Req() request: { user: { sub: string } }, @Param('id') id: string) {
    return this.listingsService.remove(request.user.sub, id);
  }
}
