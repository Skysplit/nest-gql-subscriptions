import { Module } from '@nestjs/common';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { boolean as toBoolean } from 'boolean';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync({
      imports: [TodoModule],
      inject: [ConfigService],
      useFactory(config: ConfigService): GqlModuleOptions {
        const debug = toBoolean(config.get<boolean>('GRAPHQL_DEBUG', true));
        const playground = toBoolean(
          config.get<boolean>('GRAPHQL_PLAYGROUND', true),
        );

        return {
          include: [TodoModule],
          autoSchemaFile: true,
          installSubscriptionHandlers: true,
          definitions: {
            emitTypenameField: true,
          },
          debug,
          playground,
        };
      },
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
