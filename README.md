# Sistema de Compras Online - NestJS + Prisma + SQLite

## Visão Geral

API backend para um sistema de compras online, desenvolvida com NestJS, TypeScript e Prisma ORM (SQLite). Permite gerenciar produtos, coleções, carrinho de compras, itens do carrinho e histórico de compras.

## Funcionalidades
- CRUD de produtos
- CRUD de coleções
- Adicionar/remover/atualizar itens no carrinho
- Finalizar compra e histórico de carrinhos
- Cálculo automático do preço total do carrinho
- Busca de múltiplos produtos por array de IDs
- Testes unitários abrangentes (80%+)

## Instalação e Execução

```bash
pnpm install
pnpm prisma migrate dev
pnpm start:dev
```

## Estrutura do Projeto
- `src/products/` - Produtos
- `src/collection/` - Coleções
- `src/cart/` - Carrinho
- `src/cart-item/` - Itens do carrinho
- `prisma/schema.prisma` - Modelos do banco

## Endpoints Principais

### Produtos
- `POST /products` - Criar produto
- `GET /products` - Listar produtos
- `GET /products/:id` - Buscar produto por ID
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto
- `POST /products/many` - Buscar múltiplos produtos por array de IDs

### Coleções
- `POST /collection` - Criar coleção
- `GET /collection` - Listar coleções
- `GET /collection/:id` - Buscar coleção por ID
- `PUT /collection/:id` - Atualizar coleção
- `DELETE /collection/:id` - Remover coleção

### Carrinho
- `POST /cart` - Criar carrinho
- `GET /cart/current` - Buscar carrinho pendente com itens
- `POST /cart/finalizar` - Finalizar carrinho atual
- `GET /cart/historico` - Listar carrinhos finalizados

### Itens do Carrinho
- `POST /cart-item` - Adicionar item ao carrinho (incrementa quantidade se já existir)
- `PUT /cart-item/:id` - Atualizar item do carrinho
- `DELETE /cart-item/:id` - Remover item do carrinho

## Exemplos de Requisições

### Criar Produto
```http
POST /products
{
  "name": "Tênis X",
  "description": "Tênis esportivo",
  "price": 199.99,
  "collectionId": "..."
}
```

### Adicionar Item ao Carrinho
```http
POST /cart-item
{
  "cartId": "...",
  "productId": "...",
  "quantity": 2,
  "size": "M"
}
```

### Finalizar Carrinho
```http
POST /cart/finalizar
```

## Testes

- Testes unitários em `src/*/*.spec.ts` (Jest)
- Cobertura: `pnpm test -- --coverage` ou  `npx jest --coverage`

## Modelos (Prisma)

Veja `prisma/schema.prisma` para detalhes dos modelos `Product`, `Cart`, `CartItem`, `Colection` e enum `Size`.

## Observações
- Mensagens de erro amigáveis e validação de dados via DTOs.
- Banco SQLite local para fácil setup.

## Autor
- Desenvolvido por Gabriel Melo Cavalcanti de Albuquerque

---

> Para dúvidas, sugestões ou melhorias, abra uma issue ou envie um pull request.
