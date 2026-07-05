import { Body, Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AddListingDocumentDto } from './dto/add-listing-document.dto';
import { CreateDocumentUploadUrlDto } from './dto/create-document-upload-url.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { DocumentsService } from './documents.service';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('listings/:listingId/documents/upload-url')
  createUploadUrl(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Body() dto: CreateDocumentUploadUrlDto,
  ) {
    return this.documentsService.createUploadUrl(request.user.sub, listingId, dto);
  }

  @Post('listings/:listingId/documents')
  addDocument(
    @Req() request: { user: { sub: string } },
    @Param('listingId') listingId: string,
    @Body() dto: AddListingDocumentDto,
  ) {
    return this.documentsService.addDocument(request.user.sub, listingId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch('admin/documents/:documentId/review')
  review(
    @Req() request: { user: { phone: string } },
    @Param('documentId') documentId: string,
    @Body() dto: ReviewDocumentDto,
  ) {
    return this.documentsService.review(documentId, request.user.phone, dto);
  }
}
