import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class AddCreativeDto {
  @ApiProperty({ required: false })
  channelId: number;

  @ApiProperty()
  templateId: number;

  @ApiProperty()
  type: $Enums.ChannelType;

  @ApiProperty()
  lang: $Enums.Language;
}

export class GetCreativeDto {
  @ApiProperty({ required: false })
  channelId: number;

  @ApiProperty()
  template: number;

  @ApiProperty()
  type: $Enums.ChannelType;

  @ApiProperty()
  status: $Enums.CreativeStatus;
}
