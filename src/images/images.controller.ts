import { Body, Controller, Delete, Param, Patch, Post, Req } from '@nestjs/common';
import { AddListingImageDto } from './dto/add-listing-image.dto';
import { CreateImageUploadUrlDto } from './dto/create-image-upload-url.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { ImagesService } from './images.service';

@Controller('listings/:listingId/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-url')
  createUploadUrl(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Body() dto: CreateImageUploadUrlDto,
  ) {
    return this.imagesService.createUploadUrl(request.user.sub, listingId, dto);
  }

  @Post()
  addImage(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Body() dto: AddListingImageDto,
  ) {
    return this.imagesService.addImage(request.user.sub, listingId, dto);
  }

  @Patch('reorder')
  reorder(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Body() dto: ReorderImagesDto,
  ) {
    return this.imagesService.reorder(request.user.sub, listingId, dto);
  }

  @Delete(':imageId')
  remove(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.imagesService.remove(request.user.sub, listingId, imageId);
  }
}
