import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoEntity } from '../todo.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.create(userId, createTodoDto);
  }

  async findAll(userId: number): Promise<TodoEntity[]> {
    return this.todoRepository.findAll(userId);
  }

  async findOne(id: number, userId: number): Promise<TodoEntity> {
    return this.getTodoOrFail(id, userId);
  }

  async update(
    id: number,
    userId: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    this.getTodoOrFail(id, userId);
    return this.todoRepository.update(id, userId, updateTodoDto) as Promise<TodoEntity>;
  }

  async remove(id: number, userId: number): Promise<TodoEntity> {
    this.getTodoOrFail(id, userId);
    return this.todoRepository.delete(id, userId) as Promise<TodoEntity>;
  }

  private async getTodoOrFail(id: number, userId: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findById(id, userId);

    if (!todo) {
      throw new NotFoundException('Todo item not found');
    }

    return todo;
  }
}