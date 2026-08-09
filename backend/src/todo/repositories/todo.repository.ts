import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TodoEntity } from '../todo.entity';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.prisma.todo.create({
      data: {
        // Validated by the global ValidationPipe before reaching the repository.
        title: createTodoDto.title as string,
        description: createTodoDto.description,
        userId,
      },
    });
  }

  async findAll(userId: number): Promise<TodoEntity[]> {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number, userId: number): Promise<TodoEntity | null> {
    return this.prisma.todo.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity | null> {
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return null;
    }

    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async delete(id: number, userId: number): Promise<TodoEntity | null> {
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) {
      return null;
    }

    return this.prisma.todo.delete({
      where: { id },
    });
  }
}