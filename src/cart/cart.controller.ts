import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, CreateCartItemDto } from './dto/create-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Post('item')
  addItem(@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartService.addItem(createCartItemDto);
  }

  @Get('pendente')
  getCurrentCartWithItems() {
    return this.cartService.getCurrentCartWithItems();
  }

  @Patch('finalizar')
  async finalizarCart() {
    return this.cartService.finalizarCart();
  }

  @Get('historico')
  getHistoricoCarts() {
    return this.cartService.getHistoricoCarts();
  }
}
