import { NotImplementedException } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  AddEmail,
  EmailFiltersArgs,
  EmailIdArgs,
  UserEmail,
} from './email.types';
import { User } from '../user/user.types';
import { EmailService } from './email.service';
import { EmailId } from './email.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailEntity } from './email.entity';
import { Equal, FindOptionsWhere, In, Repository } from 'typeorm';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(
    private readonly _service: EmailService,
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity> = {};

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

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    // TODO IMPLEMENTATION
    // Récupérer l'utilisateur à qui appartient l'email
    throw new NotImplementedException();
  }

  @Mutation(() => ID)
  async addEmail(@Args() email: AddEmail): Promise<EmailId> {
    return this._service.add(email);
  }

  @Mutation(() => ID)
  async deleteEmail(@Args() { emailId }: EmailIdArgs) {
    return this._service.delete(emailId);
  }
}
