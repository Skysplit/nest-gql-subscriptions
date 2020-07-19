import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { NotFoundException, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GraphQLBoolean } from 'graphql';
import { omitBy, isUndefined } from 'lodash';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

const pubsub = new PubSub();

@Resolver(() => Todo)
export class TodoResolver {
  @Inject()
  todoService: TodoService;

  @Query(() => [Todo])
  async todoList(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Query(() => Todo)
  async todo(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ): Promise<Todo> {
    return await this.todoService.find(id);
  }

  @Mutation(() => Todo)
  async createTodo(
    @Args('text') text: string,
    @Args('description', {
      defaultValue: '',
    })
    description: string,
  ): Promise<Todo> {
    const todo = await this.todoService.create({
      text,
      description,
    });

    await pubsub.publish('todoAdded', {
      todoAdded: todo,
    });

    return todo;
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('id', {
      type: () => Int,
    })
    id: number,

    @Args('text', {
      nullable: true,
    })
    text: string,

    @Args('description', {
      nullable: true,
    })
    description: string,

    @Args('completed', {
      nullable: true,
      type: () => GraphQLBoolean,
    })
    completed: boolean,
  ): Promise<Todo> {
    const todo = this.todoService.update(id, {
      text,
      description,
      completed,
    });

    await pubsub.publish('todoUpdated', {
      todoUpdated: todo,
    });

    return todo;
  }

  @Mutation(() => Todo)
  async removeTodo(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ): Promise<Todo> {
    const todo = await this.todoService.destroy(id);

    await pubsub.publish('todoRemoved', {
      todoRemoved: todo,
    });

    return todo;
  }

  @Subscription(() => Todo, {
    name: 'todoAdded',
  })
  handleTodoAdded(): AsyncIterator<Todo> {
    return pubsub.asyncIterator<Todo>('todoAdded');
  }

  @Subscription(() => Todo, {
    name: 'todoUpdated',
  })
  handleTodoUpdated(): AsyncIterator<Todo> {
    return pubsub.asyncIterator('todoUpdated');
  }

  @Subscription(() => Todo, {
    name: 'todoRemoved',
  })
  handleTodoRemoved(): AsyncIterator<Todo> {
    return pubsub.asyncIterator('todoRemoved');
  }
}
