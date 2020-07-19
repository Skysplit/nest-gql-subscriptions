import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TodoModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage: ':memory:',
      synchronize: true,
      autoLoadModels: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
