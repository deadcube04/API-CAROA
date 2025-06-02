import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCartDto, CreateCartItemDto, UpdateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCartDto: CreateCartDto) {
    return this.prisma.cart.create({ data: { ...createCartDto, status: 'Pendente' } });
  }

  async addItem(createCartItemDto: CreateCartItemDto) {
    const { cartId, productId, size, quantity } = createCartItemDto;
    // Verifica se já existe um CartItem com o mesmo cartId, productId e size
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, productId, size },
    });
    if (existingItem) {
      // Se já existe, incrementa a quantidade
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Se não existe, cria um novo CartItem
      await this.prisma.cartItem.create({
        data: { cartId, productId, size, quantity },
      });
    }
    // Recalcula o totalPrice do carrinho
    const cartItems = await this.prisma.cartItem.findMany({ where: { cartId } });
    let totalPrice = 0;
    for (const item of cartItems) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }
    await this.prisma.cart.update({ where: { id: cartId }, data: { totalPrice } });
    return this.prisma.cart.findUnique({ where: { id: cartId }, include: { items: true } });
  }

  async getCurrentCartWithItems() {
    return this.prisma.cart.findFirst({
      where: { status: 'Pendente' },
      include: { items: true },
    });
  }

  async finalizarCart() {
    // Busca o carrinho pendente
    const cart = await this.prisma.cart.findFirst({ where: { status: 'Pendente' } });
    if (!cart) {
      throw new Error('Nenhum carrinho pendente encontrado');
    }
    // Atualiza o status para Concluido
    await this.prisma.cart.update({ where: { id: cart.id }, data: { status: 'Concluido' } });
    // Cria um novo carrinho pendente
    const novoCarrinho = await this.prisma.cart.create({ data: { totalPrice: 0, status: 'Pendente' } });
    return { finalizado: cart, novoCarrinho };
  }

  async getHistoricoCarts() {
    return this.prisma.cart.findMany({
      where: { status: 'Concluido' },
      include: { items: true },
    });
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
