import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/taskStatus';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list',
  imports: [DragDropModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  @Input() taskList: Task[] = [];
  @Output() taskDeleted = new EventEmitter<number | string>();
  @Output() taskSelectedForEdit = new EventEmitter<Task>();
  @Output() tasksReordered = new EventEmitter<Task[]>();
  @Input() columnStatus!: TaskStatus;
  @Output() taskStatusChanged = new EventEmitter<Task>();
  
  //delete method in tasklist
  deleteTask(taskId: number | string): void {
    this.taskDeleted.emit(taskId);
  }

  //edit method in tasklist
  editTask(task: Task): void{
    this.taskSelectedForEdit.emit(task);
  }

  //create drop method
  dropTask(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.taskList, event.previousIndex, event.currentIndex);
      this.tasksReordered.emit(this.taskList);
      return;
    }

    const movedTask = event.previousContainer.data[event.previousIndex];

    const updatedTask: Task = {
      ...movedTask,
      status: this.columnStatus,
    };

    this.taskStatusChanged.emit(updatedTask);
  }

  //returns different CSS classes depending on the task status
  getStatusClass(status: TaskStatus): string{
    if(status === TaskStatus.Todo){
      return 'statusBadge todoStatus';
    }
    if(status === TaskStatus.InProgress){
      return 'statusBadge inProgressStatus';
    }
    return 'statusBadge completedStatus';
  }

  //confirmation before deleting
  pendingDeleteTaskId: number | string | null = null;

  confirmDelete(taskId: number | string): void {
    this.pendingDeleteTaskId = taskId;
  }

  cancelDelete(): void {
    this.pendingDeleteTaskId = null;
  }
}
