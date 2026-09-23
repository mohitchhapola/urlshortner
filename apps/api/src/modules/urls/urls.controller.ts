import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlInput } from "@urlshortner/shared";


@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: unknown) {
     const data = CreateUrlInput.parse(createUrlDto);
    return this.urlsService.create(data);
  }

  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return this.urlsService.update(+id, updateUrlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlsService.remove(+id);
  }
}
