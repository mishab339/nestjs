import { IntersectionType } from '@nestjs/mapped-types';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

class GetTweetBaseDto {
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}

export class GetTweetQueryDto extends IntersectionType(
  GetTweetBaseDto,
  PaginationQueryDto,
) {}
// This DTO combines pagination and optional date filters for fetching tweets.