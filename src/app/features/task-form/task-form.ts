import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TaskStatus } from '../../models/taskStatus';

//FormsModule enables Angular's two-way data binding ujsing [(ngModel)]
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})

export class TaskForm implements OnChanges {
  title = '';
  description = '';
  dueDate = '';
  priority = 'Medium';
  status: TaskStatus = TaskStatus.Todo;
  category = '';
  errorMessage = '';

  // create event
  @Output() taskCreated = new EventEmitter<Task>();

  //create an update event
  @Output() taskUpdated = new EventEmitter<Task>();

  //TaskForm can receive the task selected in Dashboard
  @Input() selectedTask: Task | null = null;
  
  //Add close event in TaskForm
  @Output() formClosed = new EventEmitter<void>();

  //fill the form when editing a task
  ngOnChanges(): void {
    if (this.selectedTask) {
      this.title = this.selectedTask.title;
      this.description = this.selectedTask.description;
      this.dueDate = this.selectedTask.dueDate;
      this.priority = this.selectedTask.priority;
      this.status = this.selectedTask.status;
      this.category = this.selectedTask.category;
    }
  }

  //the calendar date is clickable
  openDatePicker(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.showPicker) {
      input.showPicker(); //Open the native date picker programmatically.
    }
  }

  // close form method
  closeForm(): void {
    this.formClosed.emit();
  }

  addTask(): void {
  //basic validation before creating a task
  if (!this.title.trim()) {
    this.errorMessage = 'Please enter a task title.';
    return;
  }

  if (!this.description.trim()) {
    this.errorMessage = 'Please enter a task description.';
    return;
  }

  if (!this.dueDate) {
    this.errorMessage = 'Please select a due date.';
    return;
  }

  if (!this.priority) {
    this.errorMessage = 'Please select a priority level.';
    return;
  }

  if (!this.status) {
    this.errorMessage = 'Please select a task status.';
    return;
  }

  if (!this.category.trim()) {
    this.errorMessage = 'Please enter a category.';
    return;
  }
  this.errorMessage = '';


  // update addTask() to handle edit mode
  if (this.selectedTask) {
  const updatedTask: Task = {
    ...this.selectedTask,
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    priority: this.priority,
    status: this.status,
    category: this.category,
  };

  this.taskUpdated.emit(updatedTask);

  //clear fields after editing
  this.title = '';
  this.description = '';
  this.dueDate = '';
  this.priority = 'Medium';
  this.status = TaskStatus.Todo;
  this.category = '';
  this.errorMessage = '';

  return;
}

  const newTask: Task = {
    id: Date.now(),
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    priority: this.priority,
    status: this.status,
    category: this.category,
  };

  // clear the form after adding a task
  this.taskCreated.emit(newTask);
  
  this.title = '';
  this.description = '';
  this.dueDate = '';
  this.priority = 'Medium';
  this.status = TaskStatus.Todo;
  this.category = '';
  }
}