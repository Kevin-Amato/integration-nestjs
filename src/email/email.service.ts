import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { EmailEntity } from './email.entity';
import { IEmail, EmailId, IAddEmail } from './email.interfaces';
import { IUser } from '../user/user.interfaces';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Récupère un email par rapport à un identifiant
   * @param id Identifiant de l'email à récupérer
   * @returns L'email correspondant à l'identifiant ou undefined
   */
  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  /**
   * Récupère l'utilisateur correspondant à un email par rapport à un identifiant d'email
   * @param id Identifiant de l'email
   * @returns L'utilisateur correspondant à l'identifiant de l'email ou undefined
   */
  getUserFromEmail(id: EmailId): Promise<IUser> {
    // return this.userRepository.findOneBy({ id: Equal(id) });
    return;
  }

  async add(email: IAddEmail) {
    const addedEmail = await this.emailRepository.insert({
      ...email,
    });

    const emailId = addedEmail.identifiers[0].id;
    return emailId;
  }
}
