import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async notifyListingApproved(userId: string, listingId: string) {
    this.logger.log(`Stub notification: listing ${listingId} approved for user ${userId}`);
  }
}
