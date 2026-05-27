import { Component, ChangeDetectorRef } from '@angular/core';
import { Task } from '../../models/task';
import { TaskList } from '../task-list/task-list';
import { TaskStatus } from '../../models/taskStatus';
import { TaskForm } from '../task-form/task-form';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-dashboard',
  imports: [TaskList, TaskForm, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  //re-order after drag and release
  handleTasksReordered(reorderedTasks: Task[]): void {
    const reorderedIds = new Set(reorderedTasks.map(task => task.id));

    const otherTasks = this.taskList.filter(
      task => !reorderedIds.has(task.id)
    );

    this.taskList = [...otherTasks, ...reorderedTasks];
  }
  //Inject TaskService into Dashboard
  constructor(
  private taskService: TaskService,
  private changeDetectorRef: ChangeDetectorRef
  ) {
   //save theme mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    this.isLoading = true;
    this.taskService.getTasksFromApi().subscribe({
      next: tasks => {
        this.taskList = tasks;
        this.isLoading = false;
        this.errorMessage = '';
        this.changeDetectorRef.detectChanges();
      },
      error: error => {
        //console.error('API error:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load tasks.';
        this.changeDetectorRef.detectChanges();
      }
    });
  }
  taskList: Task[] = [];
  isLoading = false;
  errorMessage = '';

  //selectedTask stores the task the user wants to edit
  selectedTask: Task | null = null;

  //add selected filter to filter update state
  selectedFilter = 'All';
  
  //add selected sort
  selectedSort = 'None';
  taskStatus = TaskStatus;
  showTaskForm = false;

  // getter - this keeps the UI synchronized with the underlying data without storing duplicate state.
  get completedTaskCount(): number {
    return this.taskList.filter(task => task.status === TaskStatus.Completed).length;
  }

  get inProgressTaskCount(): number {
    return this.taskList.filter(task => task.status === TaskStatus.InProgress).length;
  }

  get todoTaskCount(): number {
   return this.taskList.filter(task => task.status === TaskStatus.Todo).length;
  }
  // light / dark mode

  isDarkMode = false;
  toggleTheme(): void {
  this.isDarkMode = !this.isDarkMode;
  if (this.isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

  // create filter and sort task list
  get filteredTaskList(): Task[] {
    let filteredTasks = [...this.taskList];

    if (this.selectedFilter !== 'All') {
      filteredTasks = filteredTasks.filter(
        task => task.status === this.selectedFilter
      );
    }

    if (this.selectedSort === 'Title') {
      filteredTasks.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    // sort from earliest to latest
    if (this.selectedSort === 'Due Date') {
      filteredTasks.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }

    // sort by priority
    if (this.selectedSort === 'Priority') {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      filteredTasks.sort(
        (a, b) =>
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    }

    return filteredTasks;
  }

  //add task completion statistics and data visualization
  get completionPercentage(): number {
    if (this.taskList.length === 0) {
      return 0;
    }

    return Math.round((this.completedTaskCount / this.taskList.length) * 100);
  }

  //new task save to JSON Server first, then add to the UI after the API responds.
  handleTaskCreated(newTask: Task): void {
    this.taskService.createTask(newTask).subscribe(createdTask => {
      this.taskList = [...this.taskList, createdTask];
      this.selectedFilter = 'All';
      this.showTaskForm = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  //use API delete in Dashboard
  handleTaskDeleted(taskId: number | string): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    this.taskList = this.taskList.filter(
      task => task.id !== taskId
    );

    this.taskService.deleteTaskFromApi(taskId).subscribe({
      next: () => {
        this.changeDetectorRef.detectChanges();
      },
      error: error => {
        console.error('Delete failed:', error);
        this.errorMessage = 'Failed to delete task.';
      }
    });
  }

  // use API update in Dashboard
  handleTaskUpdated(updatedTask: Task): void {
    this.taskList = this.taskList.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    this.taskService.updateTaskFromApi(updatedTask).subscribe(savedTask => {
      this.taskList = this.taskList.map(task =>
        task.id === savedTask.id ? savedTask : task
      );

      this.selectedTask = null;
      this.selectedFilter = 'All';
      this.showTaskForm = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  handleFormClosed(): void {
    this.showTaskForm = false;
    this.selectedTask = null;
  }

  // create handleTaskSelectedForEdit()
  handleTaskSelectedForEdit(task: Task): void {
    this.selectedTask = task;
    this.showTaskForm = true;

    window.scrollTo({
      top: 200,
      behavior: 'smooth',
    });
  }
  // drag and release
  get todoTasks(): Task[] {
    return this.sortTasks(
      this.taskList.filter(task => task.status === TaskStatus.Todo)
    );
  }

  get inProgressTasks(): Task[] {
    return this.sortTasks(
      this.taskList.filter(task => task.status === TaskStatus.InProgress)
    );
  }

  get completedTasks(): Task[] {
    return this.sortTasks(
      this.taskList.filter(task => task.status === TaskStatus.Completed)
    );
  }
  // sort by
  sortTasks(tasks: Task[]): Task[] {
    const sortedTasks = [...tasks];

    if (this.selectedSort === 'Title') {
      sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (this.selectedSort === 'Due Date') {
      sortedTasks.sort(
        (a, b) =>
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
      );
    }

    if (this.selectedSort === 'Priority') {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      sortedTasks.sort(
        (a, b) =>
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    }

    return sortedTasks;
  }
}
