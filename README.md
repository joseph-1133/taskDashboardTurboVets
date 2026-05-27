# Task Dashboard - TurboVets

A modern task management dashboard built with Angular 21, TypeScript, JSON Server, and Angular CDK Drag & Drop.

## Features

- Create tasks with title, description, due date, priority, status, and category
- View tasks in Todo, In Progress, and Completed columns
- Edit existing tasks
- Delete tasks
- Filter tasks by status
- Sort tasks by title, due date, and priority
- Drag and drop task reordering within columns
- Drag and drop tasks between status columns
- Dashboard summary statistics
- Responsive design for desktop, tablet, and mobile devices
- Loading and error states
- Mock REST API using JSON Server
- Unit tests for key functionality
- Dark/light theme toggle
- Task completion statistics and progress visualization

## Bonus Features

- Dark/light theme toggle
- Task completion statistics and visual progress indicator
- Responsive Kanban layout
- Loading and error handling states

## Technologies Used

- Angular 21
- TypeScript
- SCSS
- Angular CDK Drag & Drop
- JSON Server
- Vitest
- Angular TestBed

## Install Dependencies

```bash
npm install
```

## Start Mock API

Run JSON Server to provide the mock REST API:

```bash
npx json-server --watch db.json --port 3000
```

API endpoint:

```text
http://localhost:3000/tasks
```

## Start Development Server

Open a second terminal and run:

```bash
npx ng serve
```

Then open:

```text
http://localhost:4200
```

## Run Unit Tests

```bash
npx ng test
```

Current Result:

```text
Test Files: 5 passed
Tests: 10 passed
```

## Architecture

The application follows a component-based architecture using Angular standalone components.

Component Structure:

- Dashboard Component
  - Main application container
  - Manages filtering, sorting, loading state, statistics, and task coordination

- Task Form Component
  - Handles task creation and editing
  - Uses event emitters to communicate changes

- Task List Component
  - Displays tasks by status
  - Handles drag-and-drop interactions using Angular CDK

- Task Service
  - Centralizes API communication
  - Handles CRUD operations through HttpClient

Data persistence is handled through a mock REST API powered by JSON Server.

## API Endpoints

- GET /tasks
- POST /tasks
- PUT /tasks/:id
- DELETE /tasks/:id

## Design Choices

The application uses a Kanban-style layout with Todo, In Progress, and Completed columns because this makes task status easy to understand visually. Angular standalone components were used to keep the application modular and maintainable. JSON Server was selected to provide a lightweight mock REST API for CRUD operations.

Angular CDK Drag & Drop was used because it provides built-in drag-and-drop behavior without needing a large external UI library.

## State Management Approach

Task data is managed through a TaskService. The Dashboard component coordinates UI state such as selected filters, sorting, loading state, and the currently selected task for editing. The service handles API communication with JSON Server using HttpClient.

## Challenges and Resolutions

One challenge was ensuring the UI updated immediately after API operations. This was resolved by updating the local task list after successful create, update, and delete operations and using change detection where needed.

Another challenge was supporting drag-and-drop status changes across columns. This was resolved by emitting the moved task from the TaskList component to the Dashboard, updating the task status, and persisting the change through the API.

## Future Improvements

With more time, I would consider adding:

- Authentication and user accounts
- GraphQL integration using Apollo Angular
- Real-time updates using WebSockets
- More advanced analytics and reporting
- Additional unit and integration tests
- Backend persistence with a production database

## Running Locally

1. Install dependencies

```bash
npm install
```

2. Start JSON Server

```bash
npx json-server --watch db.json --port 3000
```

3. Start Angular

```bash
npx ng serve
```

4. Open the application

```text
http://localhost:4200
```
