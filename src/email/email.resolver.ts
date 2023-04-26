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

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(private readonly _service: EmailService) {}

  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    // TODO IMPLEMENTATION
    // Récupérer une liste d'e-mails correspondants à des filtres

    // Je pense qu'on pourrait essayer de refactoriser pour réutiliser
    // la même chose que dans UserResolver pour récupérer les emails

    throw new NotImplementedException();
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
