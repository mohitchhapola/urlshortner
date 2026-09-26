import { Body, Controller, Post } from '@nestjs/common';
import { UrlsService } from './urls.service.js';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) { }

  @Post()
  create(@Body() dto: any) {
    const data = CreateUrlInput.parse(dto)
    return this.urlsService.create(dto);
  }// comment for git streakkkkk 
}
