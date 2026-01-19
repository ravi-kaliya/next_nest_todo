import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

  create(dto: CreateTodoDto) {
    return this.todoModel.create(dto);
  }

  findAll() {
    console.log('all data');
    
    return this.todoModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const todo = await this.todoModel.findById(id).lean();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, dto: UpdateTodoDto) {
    const todo = await this.todoModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async remove(id: string) {
    const res = await this.todoModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('Todo not found');
    return { deleted: true };
  }
}
