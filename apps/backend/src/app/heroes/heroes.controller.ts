import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { HeroesService } from './heroes.service';
import { Hero } from './entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('heroes')
@ApiTags('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all heroes' })
  @ApiResponse({ status: 200, description: 'Returns all heroes', type: [Hero] })
  async findAll(): Promise<Hero[]> {
    return this.heroesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search heroes by name' })
  @ApiQuery({ name: 'name', required: false, description: 'Hero name to search' })
  @ApiResponse({ status: 200, description: 'Returns matching heroes', type: [Hero] })
  async search(@Query('name') name?: string): Promise<Hero[]> {
    return this.heroesService.search(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hero by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hero ID' })
  @ApiResponse({ status: 200, description: 'Returns the hero', type: Hero })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  async findOne(@Param('id') id: string): Promise<Hero> {
    return this.heroesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new hero' })
  @ApiResponse({ status: 201, description: 'Hero created successfully', type: Hero })
  async create(@Body() createHeroDto: CreateHeroDto): Promise<Hero> {
    return this.heroesService.create(createHeroDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a hero' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hero ID' })
  @ApiResponse({ status: 200, description: 'Hero updated successfully', type: Hero })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  async update(
    @Param('id') id: string,
    @Body() updateHeroDto: UpdateHeroDto
  ): Promise<Hero> {
    return this.heroesService.update(+id, updateHeroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a hero' })
  @ApiParam({ name: 'id', type: 'number', description: 'Hero ID' })
  @ApiResponse({ status: 204, description: 'Hero deleted successfully' })
  @ApiResponse({ status: 404, description: 'Hero not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.heroesService.remove(+id);
  }
}
