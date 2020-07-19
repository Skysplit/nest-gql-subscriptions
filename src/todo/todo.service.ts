import { Injectable, NotFoundException } from '@nestjs/common';
import { omitBy, isUndefined } from 'lodash';
import { Todo } from './todo.model';

type TodoFields = {
  [K in keyof Todo]?: Todo[K];
};

@Injectable()
export class TodoService {
  async findAll(): Promise<Todo[]> {
    return await Todo.findAll();
  }

  async create(fields: TodoFields): Promise<Todo> {
    return await Todo.create(fields);
  }

  async find(id: number): Promise<Todo> {
    const todo = await Todo.findByPk(id);

    if (todo === null) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(id: number, fields: TodoFields): Promise<Todo> {
    const todo = await this.find(id);

    return await todo.update(omitBy(fields, value => isUndefined(value)));
  }

  async destroy(id: number): Promise<Todo> {
    const todo = await this.find(id);

    await todo.destroy();

    return todo;
  }
}
