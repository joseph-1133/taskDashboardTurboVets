import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task';
import { TaskStatus } from '../models/taskStatus';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the initial task list', () => {
    const tasks = service.getTasks();

    expect(tasks.length).toBe(3);
  });

  it('should add a task', () => {
    const newTask: Task = {
      id: 4,
      title: 'Test task',
      description: 'Testing add task',
      dueDate: '2026-05-30',
      priority: 'Low',
      status: TaskStatus.Todo,
      category: 'Personal',
    };

    service.addTask(newTask);

    expect(service.getTasks().length).toBe(4);
  });

  it('should delete a task', () => {
    service.deleteTask(1);

    const taskExists = service.getTasks().some(task => task.id === 1);

    expect(taskExists).toBe(false);
  });

  it('should update a task', () => {
    const updatedTask: Task = {
      id: 1,
      title: 'Updated task title',
      description: 'Updated description',
      dueDate: '2026-05-25',
      priority: 'High',
      status: TaskStatus.Completed,
      category: 'Work',
    };

    service.updateTask(updatedTask);

    const task = service.getTasks().find(task => task.id === 1);

    expect(task?.title).toBe('Updated task title');
    expect(task?.status).toBe(TaskStatus.Completed);
  });
});