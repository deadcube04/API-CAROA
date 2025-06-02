import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { Size } from '@prisma/client';

const mockCart = {
  id: 'cart1',
  createdAt: new Date(),
  updatedAt: new Date(),
  totalPrice: 0,
  status: 'Pendente',
  items: [],
};
const mockCartItem = {
  id: 'item1',
  cartId: 'cart1',
  productId: 'prod1',
  quantity: 2,
  size: Size.M,
};
const mockProduct = {
  id: 'prod1',
  name: 'Produto Teste',
  description: 'Desc',
  price: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  collectionId: 'col1',
};
const prismaMock = {
  cart: {
    create: jest.fn().mockResolvedValue(mockCart),
    findFirst: jest.fn().mockResolvedValue(mockCart),
    update: jest.fn().mockResolvedValue({ ...mockCart, status: 'Concluido' }),
    findUnique: jest.fn().mockResolvedValue(mockCart),
    findMany: jest.fn().mockResolvedValue([mockCart]),
  },
  cartItem: {
    findFirst: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(mockCartItem),
    findMany: jest.fn().mockResolvedValue([mockCartItem]),
    update: jest.fn().mockResolvedValue({ ...mockCartItem, quantity: 3 }),
  },
  product: {
    findUnique: jest.fn().mockResolvedValue(mockProduct),
  },
};

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a cart', async () => {
    expect(await service.create({ totalPrice: 0 })).toEqual(mockCart);
  });

  it('should add an item to cart', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    expect(
      await service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 2, size: Size.M })
    ).toBeDefined();
  });

  it('should increment quantity if item exists', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(mockCartItem);
    expect(
      await service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })
    ).toBeDefined();
  });

  it('should get current cart with items', async () => {
    expect(await service.getCurrentCartWithItems()).toEqual(mockCart);
  });

  it('should finalize cart and create new one', async () => {
    prismaMock.cart.findFirst.mockResolvedValueOnce(mockCart);
    expect(await service.finalizarCart()).toHaveProperty('finalizado');
  });

  it('should get historico carts', async () => {
    prismaMock.cart.findMany.mockResolvedValueOnce([{ ...mockCart, status: 'Concluido' }]);
    expect(await service.getHistoricoCarts()).toEqual([{ ...mockCart, status: 'Concluido' }]);
  });

  it('should throw error if finalizarCart is called with no pending cart', async () => {
    prismaMock.cart.findFirst.mockResolvedValueOnce(null);
    await expect(service.finalizarCart()).rejects.toThrow('Nenhum carrinho pendente encontrado');
  });

  it('should recalculate totalPrice correctly when adding multiple items', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.cartItem.findMany.mockResolvedValueOnce([
      { ...mockCartItem, quantity: 2, productId: 'prod1' },
      { ...mockCartItem, id: 'item2', productId: 'prod2', quantity: 3, size: Size.G },
    ]);
    prismaMock.product.findUnique.mockImplementation(({ where }) => {
      if (where.id === 'prod1') return Promise.resolve({ ...mockProduct, price: 10 });
      if (where.id === 'prod2') return Promise.resolve({ ...mockProduct, id: 'prod2', price: 20 });
      return Promise.resolve(null);
    });
    prismaMock.cart.update.mockResolvedValueOnce({ ...mockCart, totalPrice: 80 });
    prismaMock.cart.findUnique.mockResolvedValueOnce({ ...mockCart, totalPrice: 80, items: [] });
    const result = await service.addItem({ cartId: 'cart1', productId: 'prod2', quantity: 3, size: Size.G });
    expect(result).not.toBeNull();
    expect(result!.totalPrice).toBe(80);
  });

  it('should not add item if product does not exist', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.product.findUnique.mockResolvedValueOnce(null);
    prismaMock.cartItem.create.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.findMany.mockResolvedValueOnce([mockCartItem]);
    prismaMock.cart.update.mockResolvedValueOnce(mockCart);
    prismaMock.cart.findUnique.mockResolvedValueOnce(mockCart);
    const result = await service.addItem({ cartId: 'cart1', productId: 'notfound', quantity: 1, size: Size.M });
    expect(result).toBeDefined();
  });

  it('should throw error if addItem is called with invalid cartId', async () => {
    prismaMock.cartItem.findFirst.mockRejectedValueOnce(new Error('Invalid cartId'));
    await expect(service.addItem({ cartId: 'invalid', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('Invalid cartId');
  });

  it('should throw error if addItem is called with invalid productId', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.product.findUnique.mockRejectedValueOnce(new Error('Invalid productId'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'invalid', quantity: 1, size: Size.M })).rejects.toThrow('Invalid productId');
  });

  it('should throw error if addItem is called with invalid size', async () => {
    prismaMock.cartItem.findFirst.mockRejectedValueOnce(new Error('Invalid size'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: 'INVALID' as any })).rejects.toThrow('Invalid size');
  });

  it('should throw error if addItem is called with negative quantity', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.cartItem.create.mockRejectedValueOnce(new Error('Quantity must be positive'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: -1, size: Size.M })).rejects.toThrow('Quantity must be positive');
  });

  it('should return null if getCurrentCartWithItems finds no cart', async () => {
    prismaMock.cart.findFirst.mockResolvedValueOnce(null);
    expect(await service.getCurrentCartWithItems()).toBeNull();
  });

  it('should return empty array if getHistoricoCarts finds no carts', async () => {
    prismaMock.cart.findMany.mockResolvedValueOnce([]);
    expect(await service.getHistoricoCarts()).toEqual([]);
  });

  it('should call update on cart when incrementing item quantity', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.update.mockResolvedValueOnce({ ...mockCartItem, quantity: 5 });
    prismaMock.cartItem.findMany.mockResolvedValueOnce([{ ...mockCartItem, quantity: 5 }]);
    prismaMock.product.findUnique.mockResolvedValueOnce(mockProduct);
    prismaMock.cart.update.mockResolvedValueOnce({ ...mockCart, totalPrice: 50 });
    prismaMock.cart.findUnique.mockResolvedValueOnce({ ...mockCart, totalPrice: 50, items: [] });
    const result = await service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 3, size: Size.M });
    expect(result).not.toBeNull();
    expect(result!.totalPrice).toBe(50);
  });

  it('should throw error if finalizarCart update fails', async () => {
    prismaMock.cart.findFirst.mockResolvedValueOnce(mockCart);
    prismaMock.cart.update.mockRejectedValueOnce(new Error('Update failed'));
    await expect(service.finalizarCart()).rejects.toThrow('Update failed');
  });

  it('should throw error if finalizarCart create new cart fails', async () => {
    prismaMock.cart.findFirst.mockResolvedValueOnce(mockCart);
    prismaMock.cart.update.mockResolvedValueOnce({ ...mockCart, status: 'Concluido' });
    prismaMock.cart.create.mockRejectedValueOnce(new Error('Create failed'));
    await expect(service.finalizarCart()).rejects.toThrow('Create failed');
  });

  it('should throw error if addItem fails on cartItem.create', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.cartItem.create.mockRejectedValueOnce(new Error('Create cartItem failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('Create cartItem failed');
  });

  it('should throw error if addItem fails on cartItem.update', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.update.mockRejectedValueOnce(new Error('Update cartItem failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('Update cartItem failed');
  });

  it('should throw error if addItem fails on cart.update', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.update.mockResolvedValueOnce({ ...mockCartItem, quantity: 3 });
    prismaMock.cartItem.findMany.mockResolvedValueOnce([mockCartItem]);
    prismaMock.product.findUnique.mockResolvedValueOnce(mockProduct);
    prismaMock.cart.update.mockRejectedValueOnce(new Error('Update cart failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('Update cart failed');
  });

  it('should throw error if addItem fails on cart.findUnique', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.update.mockResolvedValueOnce({ ...mockCartItem, quantity: 3 });
    prismaMock.cartItem.findMany.mockResolvedValueOnce([mockCartItem]);
    prismaMock.product.findUnique.mockResolvedValueOnce(mockProduct);
    prismaMock.cart.update.mockResolvedValueOnce(mockCart);
    prismaMock.cart.findUnique.mockRejectedValueOnce(new Error('FindUnique failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('FindUnique failed');
  });

  it('should throw error if getCurrentCartWithItems fails', async () => {
    prismaMock.cart.findFirst.mockRejectedValueOnce(new Error('FindFirst failed'));
    await expect(service.getCurrentCartWithItems()).rejects.toThrow('FindFirst failed');
  });

  it('should throw error if getHistoricoCarts fails', async () => {
    prismaMock.cart.findMany.mockRejectedValueOnce(new Error('FindMany failed'));
    await expect(service.getHistoricoCarts()).rejects.toThrow('FindMany failed');
  });

  it('should throw error if create fails', async () => {
    prismaMock.cart.create.mockRejectedValueOnce(new Error('Create cart failed'));
    await expect(service.create({ totalPrice: 0 })).rejects.toThrow('Create cart failed');
  });

  it('should throw error if addItem fails on cartItem.findMany', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.cartItem.create.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.findMany.mockRejectedValueOnce(new Error('FindMany cartItem failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('FindMany cartItem failed');
  });

  it('should throw error if addItem fails on product.findUnique', async () => {
    prismaMock.cartItem.findFirst.mockResolvedValueOnce(null);
    prismaMock.cartItem.create.mockResolvedValueOnce(mockCartItem);
    prismaMock.cartItem.findMany.mockResolvedValueOnce([mockCartItem]);
    prismaMock.product.findUnique.mockRejectedValueOnce(new Error('FindUnique product failed'));
    await expect(service.addItem({ cartId: 'cart1', productId: 'prod1', quantity: 1, size: Size.M })).rejects.toThrow('FindUnique product failed');
  });
});
