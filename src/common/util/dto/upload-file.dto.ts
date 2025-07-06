import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'url with uploaded file',
    example: 'public/uploads/1734080307415-j3cgcLtVLzsyYzY.JPG.jpg',
    type: 'string',
  })
  url: string;

  @ApiProperty({
    description: 'id with uploaded file',
    example: '1734080307415-j3cgcLtVLzsyYzY',
    type: 'string',
  })
  id: string;
}
