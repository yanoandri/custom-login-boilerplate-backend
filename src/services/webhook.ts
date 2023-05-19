import { Repository, getCustomRepository, getRepository } from 'typeorm';

import { Webhook } from 'orm/entities/webhooks/Webhook';

export class WebhookService {
  private webhookRepository: Repository<Webhook>;

  constructor(webhookRepository: Repository<Webhook>) {
    this.webhookRepository = webhookRepository;
  }

  /**
   * create
   */
  public async create(webhookData: any) {
    return this.webhookRepository.save(webhookData);
  }

  /**
   * update
   */
  public update(id: string, webhookData: any) {
    return this.webhookRepository.update({ id }, webhookData);
  }

  /**
   * delete
   */
  public delete(id: string) {
    return this.webhookRepository.delete({ id });
  }

  /**
   * get
   */
  public get(id: string) {
    return this.webhookRepository.findOne(id);
  }
}
