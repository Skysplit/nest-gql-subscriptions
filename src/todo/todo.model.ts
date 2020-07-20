import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Column, DataType, Table, Model } from 'sequelize-typescript';
import { GraphQLBoolean } from 'graphql';

@ObjectType()
@Table({
  timestamps: true,
  deletedAt: false,
})
export class Todo extends Model<Todo> {
  @Field(() => Int)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field()
  @Column({
    type: DataType.STRING,
  })
  text: string;

  @Field()
  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Field(() => GraphQLBoolean)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  completed: boolean;

  @Field(() => GraphQLISODateTime)
  @Column({
    type: DataType.DATE,
    defaultValue: () => new Date(),
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  @Column({
    type: DataType.DATE,
    defaultValue: () => new Date(),
  })
  updatedAt: Date;
}
