import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { CreateListingDto } from './dto/create-listing.dto';
import { MarkListingSoldDto } from './dto/mark-listing-sold.dto';
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

  @Public()
  @Get(':id/info-sheet')
  async infoSheet(@Param('id') id: string, @Res() response: Response) {
    const { buffer, filename } = await this.listingsService.generateInfoSheet(id);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.send(buffer);
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
  markSold(
    @Req() request: { user: { sub: string } },
    @Param('id') id: string,
    @Body() dto: MarkListingSoldDto,
  ) {
    return this.listingsService.markSold(request.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() request: { user: { sub: string } }, @Param('id') id: string) {
    return this.listingsService.remove(request.user.sub, id);
  }
}
