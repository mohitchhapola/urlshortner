import { Injectable } from '@nestjs/common';
import { handleErrors } from '../../common/validation/execption.filter.js';

@Injectable()
export class UrlsService {

    constructor() {}

    private async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = this.shortCodeService.generate();

      const exists = await this.shortUrlModel.findOne({
        where: { code },
      });   

      if (!exists) {
        // return code;
        console.log('Unable to generate unique short code');
      }
    }

    throw new Error('Unable to generate unique short code');
  }


  async create(dto: any): Promise<any> {
    try{

        const code = await this.generateUniqueCode();
    
        const shortUrl = await this.shortUrlModel.create({
          code,
          originalUrl: dto.originalUrl,
        });
    
        return {
          code: shortUrl.code,
          originalUrl: shortUrl.originalUrl,
          shortUrl: `https://yourdomain.com/${shortUrl.code}`,
        };
    } catch (error) {
        console.error('Error creating short URL:', error);
        throw new Error('Failed to create short URL');-
        // handleErrors(error);    later on we will build a custom error handler to handle errors in a more structured way
    }
  }


}
