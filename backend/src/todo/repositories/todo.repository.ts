import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TodoEntity } from '../todo.entity';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Injectable()
export class TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.prisma.todo.create({
      data: {
        // Validated by the global ValidationPipe before reaching the repository.
        title: createTodoDto.title as string,
        description: createTodoDto.description,
      },
    });
  }

  async findAll(): Promise<TodoEntity[]> {
    return this.prisma.todo.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findById(id: number): Promise<TodoEntity | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async delete(id: number): Promise<TodoEntity> {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}