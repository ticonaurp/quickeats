import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(body: { name: string; description: string; price: number; restaurantId: string }) {
    return this.prisma.product.create({ data: body });
  }

  findAll() {
    return this.prisma.product.findMany();
  }
}