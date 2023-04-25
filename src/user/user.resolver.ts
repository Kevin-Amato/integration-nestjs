import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOptionsWhere, In, Repository } from 'typeorm';
import { EmailFiltersArgs, UserEmail } from '../email/email.types';
import { EmailEntity } from '../email/email.entity';
import { UserId } from './user.interfaces';
import { UserService } from './user.service';
import { AddUser, User, UserIdArgs } from './user.types';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly _service: UserService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  @Query(() => User, { name: 'user', nullable: true })
  getUser(@Args() { userId }: UserIdArgs): Promise<User> {
    return this._service.get(userId);
  }

  @Mutation(() => ID)
  async addUser(@Args() user: AddUser): Promise<UserId> {
    // const existingUser = await this._service.getByName(user.name);

    // if (existingUser && user.birthdate) {
    //   throw new BadRequestException({
    //     message: 'La date de naissance ne peut pas être définie dans le future',
    //   });
    // }

    return this._service.add(user);
  }

  @Mutation(() => ID)
  deactivateUser(@Args() { userId }: UserIdArgs): Promise<UserId> {
    return this._service.deactivate(userId);
  }

  @ResolveField(() => [UserEmail], { name: 'emails' })
  async getEmails(
    @Parent() user: User,
    @Args() filters: EmailFiltersArgs,
  ): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity> = {
      userId: Equal(user.id),
    };

    if (filters.address) {
      if (filters.address.equal) {
        where.address = Equal(filters.address.equal);
      }

      if (filters.address.in?.length > 0) {
        where.address = In(filters.address.in);
      }
    }

    return this.emailRepository.find({
      where,
      order: { address: 'asc' },
    });
  }
}
