import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { TaskStatus } from '../models/taskStatus';
//inject HttpClient into TaskService
import { HttpClient } from '@angular/common/http';
//fetch tasks from the API
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  constructor(private http: HttpClient) {}

  private taskList: Task[] = [
    {
      id: 1,
      title: 'Finish Angular assignment',
      description: 'Build the first version of the task dashboard',
      dueDate: '2026-05-25',
      priority: 'High',
      status: TaskStatus.InProgress,
      category: 'Work',
    },
    {
      id: 2,
      title: 'Review project requirements',
      description: 'Make sure all required features are included',
      dueDate: '2026-05-24',
      priority: 'Medium',
      status: TaskStatus.Todo,
      category: 'Work',
    },
    {
      id: 3,
      title: 'Setup Angular project',
      description: 'Initialize project and create dashboard',
      dueDate: '2026-05-20',
      priority: 'High',
      status: TaskStatus.Completed,
      category: 'Work',
    },
  ];
  getTasks(): Task[] {
    return this.taskList;
  }

  // fetch tasks from the API
    getTasksFromApi(): Observable<Task[]> {
  return this.http.get<Task[]>('http://localhost:3000/tasks');
}

  //push logic into the service
  addTask(task: Task): void {
    this.taskList.push(task);
  }

  //delete logic into the service
  deleteTask(taskId: number): void {
    this.taskList = this.taskList.filter(task => task.id !== taskId);
  }

  //update logic into service
  updateTask(updatedTask: Task): void {
    this.taskList = this.taskList.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  // add API create method
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>('http://localhost:3000/tasks', task);
  }

  //add API delete method
  deleteTaskFromApi(taskId: number | string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/tasks/${taskId}`);
  }

  //add API update method
  updateTaskFromApi(updatedTask: Task): Observable<Task> {
    return this.http.put<Task>(
      `http://localhost:3000/tasks/${updatedTask.id}`,
      updatedTask
    );
  }
}