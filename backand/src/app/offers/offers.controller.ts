import { Controller, Get, Param } from '@nestjs/common';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.offersService.createOffers(+id);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    return await this.offersService.getOffersStatus(+id);
  }
}
