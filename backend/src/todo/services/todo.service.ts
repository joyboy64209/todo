import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from '../repositories/todo.repository';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoEntity } from '../todo.entity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    return this.todoRepository.create(createTodoDto);
  }

  async findAll(): Promise<TodoEntity[]> {
    return this.todoRepository.findAll();
  }

  async findOne(id: number): Promise<TodoEntity> {
    return this.getTodoOrFail(id);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    this.getTodoOrFail(id);
    return this.todoRepository.update(id, updateTodoDto);
  }

  async remove(id: number): Promise<TodoEntity> {
    this.getTodoOrFail(id);
    return this.todoRepository.delete(id);
  }

  private async getTodoOrFail(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findById(id);

    if (!todo) {
      throw new NotFoundException('Todo item not found');
    }

    return todo;
  }
}