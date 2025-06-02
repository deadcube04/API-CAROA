import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, description, price, collectionId } = createProductDto;
    return this.prisma.product.create({
      data: { name, description, price, collectionId }
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: updateProductDto });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async findManyByIds(ids: string[]) {
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }
}
