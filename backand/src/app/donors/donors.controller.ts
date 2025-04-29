import { Controller } from '@nestjs/common';
import { DonorsService } from './donors.service';

@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) {}
}
