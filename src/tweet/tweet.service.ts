import {
  Injectable,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { Paginated } from 'src/common/pagination/pagination.interface';

@Injectable()
export class TweetService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashtagService: HashtagService,
    @InjectRepository(Tweet)
    private readonly tweetRepository: Repository<Tweet>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async getTweets(
    userId: number,
    pageQueryDto: PaginationQueryDto,
  ): Promise<Paginated<Tweet>> {
    let user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with userId ${userId} is not found`);
    }
    return await this.paginationProvider.paginateQuery(
      pageQueryDto,
      this.tweetRepository,
      {
        user: {
          id: userId,
        },
      },
    );
  }

  public async createTweet(CreateTweetDto: CreateTweetDto) {
    let user = await this.usersService.getUserById(CreateTweetDto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hashtags = await this.hashtagService.findHashTag(
      CreateTweetDto.hashtags ?? [],
    );

    let tweet = await this.tweetRepository.create({
      ...CreateTweetDto,
      user: user,
      hashtags: hashtags,
    });
    await this.tweetRepository.save(tweet);
    return tweet;
  }

  public async updateTweet(updateTweetDto: UpdateTweetDto) {
    let hashtags = await this.hashtagService.findHashTag(
      updateTweetDto.hashtags ?? [],
    );
    let tweet = await this.tweetRepository.findOneBy({ id: updateTweetDto.id });
    if (tweet) {
      tweet.text = updateTweetDto.text ?? tweet.text;
      tweet.image = updateTweetDto.image ?? tweet.image;
      tweet.hashtags = hashtags;

      return await this.tweetRepository.save(tweet);
    }
  }

  public async deleteTweet(id: number) {
    this.tweetRepository.delete({
      id,
    });

    return { deleted: true };
  }
}
