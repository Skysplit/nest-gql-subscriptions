import { Module } from '@nestjs/common';
import { TodoResolver } from './todo.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { Todo } from './todo.model';
import { TodoService } from './todo.service';

@Module({
  imports: [SequelizeModule.forFeature([Todo])],
  providers: [TodoService, TodoResolver],
  exports: [TodoResolver],
})
export class TodoModule {}
