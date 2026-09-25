import { Injectable } from '@nestjs/common';
// import { handleErrors } from '../../common/validation/execption.filter.js';
import { PrismaService } from '../../common/database/prisma/prisma.service.js';

@Injectable()
export class UrlsService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  private async generateUniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt++) {
      // const code = this.shortCodeService.generate();
      const code = Math.random().toString(36).substring(2, 8);

      const exists = await this.prisma.urls.findFirst({
        where: { short_code: code },
      });

      if (!exists) {
        // return code;
        console.log('Unable to generate unique short code');
      }
    }

    throw new Error('Unable to generate unique short code');
  }


  async create(dto: any): Promise<any> {
    try {

      const code = await this.generateUniqueCode();

      const shortUrl = await this.prisma.urls.create({
        data: {
          short_code: code,
          original_url: dto.originalUrl,
          userid: dto.userid
        }
      });

      return {
        code: shortUrl.short_code,
        originalUrl: shortUrl.original_url,
        shortUrl: `https://yourdomain.com/${shortUrl.short_code}`,
      };
    } catch (error) {
      console.error('Error creating short URL:', error);
      throw new Error('Failed to create short URL');
      // handleErrors(error);    later on we will build a custom error handler to handle errors in a more structured way
    }
  }


}
