// import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';
import { nanoid } from 'nanoid'
import { BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export abstract class CustomBaseEntity extends BaseEntity {

    @Field(() => String)
    @PrimaryGeneratedColumn()
    uuid: string = nanoid(10);

    @Field(() => String)
    @CreateDateColumn()
    createdAt?: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt?: Date;

}