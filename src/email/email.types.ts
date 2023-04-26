import { ArgsType, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Maybe } from 'graphql/jsutils/Maybe';
import { IAddEmail, IEmail, IEmailFilters } from './email.interfaces';

@ObjectType()
export class UserEmail implements IEmail {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  address: string;

  userId: string;
}

@InputType()
export class StringFilters {
  @IsOptional()
  @Field(() => String, { nullable: true })
  equal: Maybe<string>;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  in: Maybe<string[]>;
}

@ArgsType()
export class EmailFiltersArgs implements IEmailFilters {
  @IsOptional()
  @Field(() => StringFilters, { nullable: true })
  address?: Maybe<StringFilters>;
}

@InputType()
@ArgsType()
export class AddEmail implements IAddEmail {
  @IsEmail({}, { message: "L'adresse n'est pas une adresse email valide" })
  @IsNotEmpty({ message: "L'adresse de l'utilisateur n'est pas défini" })
  @MaxLength(50)
  @Field(() => String)
  address: string;

  @IsNotEmpty({ message: `L'identifiant de l'utilisateur n'est pas défini` })
  @IsUUID('all', {
    message: `L'identifiant de l'utilisateur doit être un UUID`,
  })
  @Field(() => String)
  userId: string;
}

@ArgsType()
export class EmailIdArgs {
  @IsUUID('all', {
    message: `L'identifiant de l'email doit être un UUID`,
  })
  @IsNotEmpty({ message: `L'identifiant de l'email doit être défini` })
  @Field(() => String)
  emailId: string;
}
