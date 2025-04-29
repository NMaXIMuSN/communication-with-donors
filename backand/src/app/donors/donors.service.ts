import { Injectable } from '@nestjs/common';
import { PrismaDonorService } from '../prismaDonor.service';

@Injectable()
export class DonorsService {
  constructor(private prismaDonor: PrismaDonorService) {}
  async getDonorInfoWithInclude(donorId: number, include: string[]) {
    return await this.prismaDonor.donor.findUnique({
      where: {
        id: donorId,
      },
      include: Object.fromEntries(include.map((table) => [table, true])),
    });
  }
}
