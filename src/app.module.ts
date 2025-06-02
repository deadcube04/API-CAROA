import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { PrismaService } from './prisma.service';
import { CollectionModule } from './collection/collection.module';
import { CartItemModule } from './cart-item/cart-item.module';

@Module({
  imports: [ProductsModule, CartModule, CollectionModule, CartItemModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
