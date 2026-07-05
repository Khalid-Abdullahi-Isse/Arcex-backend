import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ReviewListingDto } from './dto/review-listing.dto';
import { AdminService } from './admin.service';

@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('listings/pending')
  pendingListings() {
    return this.adminService.pendingListings();
  }

  @Patch('listings/:id/approve')
  approveListing(@Param('id') id: string) {
    return this.adminService.approveListing(id);
  }

  @Patch('listings/:id/reject')
  rejectListing(@Param('id') id: string, @Body() dto: ReviewListingDto) {
    return this.adminService.rejectListing(id, dto);
  }

  @Get('documents/pending')
  pendingDocuments() {
    return this.adminService.pendingDocuments();
  }
}
