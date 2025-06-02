import { Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCollectionDto: CreateCollectionDto) {
    const { name, description } = createCollectionDto;
    return this.prisma.colection.create({ data: { name, description } });
  }

  async findAll() {
    return this.prisma.colection.findMany();
  }

  async findOne(id: string) {
    return this.prisma.colection.findUnique({ where: { id } });
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    return this.prisma.colection.update({ where: { id }, data: updateCollectionDto });
  }

  async remove(id: string) {
    return this.prisma.colection.delete({ where: { id } });
  }
}
