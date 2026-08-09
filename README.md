# 📋 Todo App — Full-Stack Documentation

A full-stack todo application built with **NestJS** (backend), **React + TypeScript** (frontend), **Prisma ORM**, **PostgreSQL**, and **Tailwind CSS**.

---

## 📁 Project Structure

```
to-do/
├── package.json                  # Root package (build script only)
│
├── backend/
│   ├── package.json              # Backend dependencies & scripts
│   ├── nest-cli.json             # NestJS CLI config
│   ├── tsconfig.json             # TypeScript config for backend
│   ├── .gitignore                # Ignores node_modules, dist, .env, logs
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema (Todo model)
│   │   └── migrations/           # Auto-generated migration files
│   └── src/
│       ├── main.ts               # App entry point (bootstrap, CORS, ValidationPipe)
│       ├── app.module.ts         # Root NestJS module
│       ├── prisma/
│       │   ├── prisma.module.ts  # Global shared module for Prisma
│       │   └── prisma.service.ts # Prisma client wrapper (DB connection)
│       └── todo/
│           ├── todo.module.ts    # Todo feature module
│           ├── todo.controller.ts# REST API routes (CRUD)
│           ├── todo.service.ts   # Business logic (CRUD operations)
│           └── dto/
│               ├── create-todo.dto.ts  # Validation for POST body
│               └── update-todo.dto.ts  # Validation for PATCH body
│
└── frontend/
    ├── package.json              # Frontend dependencies & scripts
    ├── index.html                # HTML shell (mounts React app)
    ├── vite.config.ts            # Vite + React + Tailwind plugins
    ├── tsconfig.json             # TypeScript project references
    ├── tsconfig.app.json         # TypeScript config for app code
    ├── tsconfig.node.json        # TypeScript config for Vite/Node
    └── src/
        ├── main.tsx              # React entry point
        ├── App.tsx               # Main component (all UI + logic)
        ├── index.css             # Tailwind import + global styles
        ├── vite-env.d.ts         # Vite type declarations
        └── services/
            └── api.ts            # HTTP service (fetch calls to backend)
```

---

## 🗄️ Database Schema

**File:** `backend/prisma/schema.prisma`

```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

| Field       | Type     | Notes                              |
|-------------|----------|------------------------------------|
| `id`        | Int      | Auto-incremented primary key       |
| `title`     | String   | Required — the task name           |
| `description` | String? | Optional — extra details about the task |
| `completed` | Boolean  | Defaults to `false`                |
| `createdAt` | DateTime | Set automatically on creation      |
| `updatedAt` | DateTime | Updated automatically on changes   |

**Database:** PostgreSQL (configured via `DATABASE_URL` environment variable in `backend/.env`)

---

## 🔧 Backend — NestJS + Prisma

### `backend/src/main.ts` — Application Bootstrap

```typescript
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',  // Allows frontend dev server to call API
  });

  app.useGlobalPipes(new ValidationPipe());  // Auto-validates incoming DTOs
  await app.listen(3000);
}
bootstrap();
```

**What it does:**
- Loads environment variables from `.env` via `dotenv/config`
- Creates the NestJS application from `AppModule`
- Enables CORS for the Vite dev server at `localhost:5173`
- Registers a global `ValidationPipe` so DTO validation rules fire automatically
- Starts the server on port **3000**

---

### `backend/src/app.module.ts` — Root Module

```typescript
import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TodoModule, PrismaModule],
})
export class AppModule {}
```

**What it does:** Imports `TodoModule` (feature logic) and `PrismaModule` (database connection).

---

### `backend/src/prisma/prisma.service.ts` — Database Service

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({});
  }

  async onModuleInit() {
    await this.$connect();  // Connects to PostgreSQL when the app starts
  }
}
```

**What it does:**
- Extends `PrismaClient` (auto-generated from `schema.prisma`)
- Connects to the database when the NestJS module initializes
- Provides methods like `this.prisma.todo.findMany()`, `this.prisma.todo.create()`, etc.

---

### `backend/src/prisma/prisma.module.ts` — Database Module

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**What it does:**
- `@Global()` — makes `PrismaService` available everywhere without re-importing
- Exports `PrismaService` so other modules (like `TodoModule`) can inject it

---

### `backend/src/todo/todo.module.ts` — Todo Module

```typescript
import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
```

**What it does:** Registers the `TodoController` (routes) and `TodoService` (logic).

---

### `backend/src/todo/todo.controller.ts` — REST API Endpoints

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')  // Base path: /todo
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);  // +id converts string to number
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
```

**API Endpoints:**

| Method   | URL              | Body             | Description          |
|----------|------------------|------------------|----------------------|
| `POST`   | `/todo`          | `CreateTodoDto`  | Create a new todo    |
| `GET`    | `/todo`          | —                | Get all todos        |
| `GET`    | `/todo/:id`      | —                | Get a single todo    |
| `PATCH`  | `/todo/:id`      | `UpdateTodoDto`  | Update a todo        |
| `DELETE` | `/todo/:id`      | —                | Delete a todo        |

---

### `backend/src/todo/todo.service.ts` — Business Logic

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new todo
  async create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
      },
    });
  }

  // Get all todos (newest first)
  async findAll() {
    return this.prisma.todo.findMany({
      orderBy: { id: 'desc' },
    });
  }

  // Get a single todo by ID
  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });
    if (!todo) throw new NotFoundException('Todo item not found');
    return todo;
  }

  // Update a todo (edit title, description, or mark complete/incomplete)
  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id);  // Throws NotFoundException if missing
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  // Delete a todo
  async remove(id: number) {
    await this.findOne(id);  // Throws NotFoundException if missing
    return this.prisma.todo.delete({ where: { id } });
  }
}
```

**Key patterns:**
- `findOne` is reused in `update` and `remove` to verify the todo exists before acting
- `orderBy: { id: 'desc' }` shows newest todos first
- `NotFoundException` returns a 404 HTTP response automatically

---

### `backend/src/todo/dto/create-todo.dto.ts` — Create Validation

```typescript
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()       // Title must be a non-empty string
  title: string;

  @IsString()
  @IsOptional()       // Description is optional
  description?: string;
}
```

### `backend/src/todo/dto/update-todo.dto.ts` — Update Validation

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsBoolean()
  @IsOptional()       // Can toggle completed status
  completed?: boolean;
}
```

**What it does:**
- `PartialType(CreateTodoDto)` — makes all fields optional when updating
- Adds `completed` boolean field for toggling task status
- Validation errors are automatically returned as 400 responses by `ValidationPipe`

---

## 🎨 Frontend — React + TypeScript + Tailwind CSS

### `frontend/index.html` — HTML Shell

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**What it does:** Minimal HTML that mounts the React app into `#root`.

---

### `frontend/src/main.tsx` — React Entry Point

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**What it does:** Renders the `App` component into the DOM with React StrictMode.

---

### `frontend/src/services/api.ts` — API Service

```typescript
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const todoService = {
  async getAll(): Promise<Todo[]> {
    const response = await fetch('http://localhost:3000/todo');
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  async create(title: string, description: string): Promise<Todo> {
    const response = await fetch('http://localhost:3000/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async update(id: number, data: Partial<{ title: string; description: string; completed: boolean }>): Promise<Todo> {
    const response = await fetch(`http://localhost:3000/todo/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`http://localhost:3000/todo/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
  },
};
```

**What it does:**
- Defines the `Todo` interface matching the backend model
- Provides `getAll()`, `create()`, `update()`, `delete()` methods
- Each method calls the NestJS backend at `http://localhost:3000/todo`
- Returns parsed JSON (or void for delete)

---

### `frontend/src/App.tsx` — Main Component (State + UI)

This single file contains **all** the frontend logic and UI. Here's how each feature works:

#### State Variables

```typescript
const [todos, setTodos] = useState<Todo[]>([]);        // All todo items
const [title, setTitle] = useState('');                 // New todo title input
const [loading, setLoading] = useState(true);           // Loading spinner state
const [editingId, setEditingId] = useState<number | null>(null);   // Which todo is being edited
const [editTitle, setEditTitle] = useState('');         // Edit title input
const [editDescription, setEditDescription] = useState('');        // Edit description input
const [expandedDescId, setExpandedDescId] = useState<number | null>(null);  // Expanded description
const [descInputValue, setDescInputValue] = useState('');           // Description textarea value
```

#### Load todos on mount

```typescript
useEffect(() => {
  fetchTodos();   // Called once when component mounts
}, []);
```

#### Create a new todo

```typescript
const handleCreateTodo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;
  const newTodo = await todoService.create(title, '');
  setTodos((prev) => [newTodo, ...prev]);  // Add new todo to top of list
  setTitle('');                            // Clear input
};
```

- Triggered by the "Add Todo" button in the form
- Calls `todoService.create()` → `POST /todo`
- Prepends the new todo to the list (newest first)

#### Toggle complete/incomplete

```typescript
const handleToggleComplete = async (id: number, currentStatus: boolean) => {
  const updatedTodo = await todoService.update(id, { completed: !currentStatus });
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? updatedTodo : todo))
  );
};
```

- Triggered by clicking the circular checkbox
- Calls `todoService.update()` → `PATCH /todo/:id` with `{ completed: true/false }`
- Updates the todo in state with the server response

#### Delete a todo

```typescript
const handleDeleteTodo = async (id: number) => {
  await todoService.delete(id);
  setTodos((prev) => prev.filter((todo) => todo.id !== id));
};
```

- Triggered by clicking the red trash icon
- Calls `todoService.delete()` → `DELETE /todo/:id`
- Removes the todo from the state array

#### Edit a todo (title + description)

**Start editing:**
```typescript
const startEditing = (todo: Todo) => {
  setEditingId(todo.id);
  setEditTitle(todo.title);
  setEditDescription(todo.description || '');
};
```

**Save edits:**
```typescript
const handleSaveEdit = async (id: number) => {
  if (!editTitle.trim()) return;
  const updatedTodo = await todoService.update(id, {
    title: editTitle,
    description: editDescription || undefined,
  });
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? updatedTodo : todo))
  );
  cancelEditing();  // Exit edit mode
};
```

- Edit mode is activated per-todo by clicking the pencil/edit icon
- Shows input fields for title + description
- Save calls `PATCH /todo/:id` with updated values
- Cancel exits edit mode without saving

#### Expand/collapse and edit description

**Toggle description visibility:**
```typescript
const toggleDescription = (id: number, currentDesc: string | null) => {
  if (expandedDescId === id) {
    setExpandedDescId(null);      // Collapse
    setDescInputValue('');
  } else {
    setExpandedDescId(id);        // Expand
    setDescInputValue(currentDesc || '');
  }
};
```

**Save description changes:**
```typescript
const handleSaveDescription = async (id: number) => {
  const updatedTodo = await todoService.update(id, {
    description: descInputValue || undefined,
  });
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? updatedTodo : todo))
  );
  setExpandedDescId(null);
  setDescInputValue('');
};
```

- Clicking the chevron (▼) icon expands/collapses the description section per todo
- If a description exists, it shows the text and an "Edit description" button
- If no description exists, it shows a textarea and "Save Description" button
- Descriptions are saved individually without affecting the title/complete state

#### UI States

| State          | What the user sees                                              |
|----------------|-----------------------------------------------------------------|
| **Loading**    | Spinning emerald ring + "Loading tasks..." text                 |
| **Empty**      | 🎉 emoji + "No tasks yet. Create one above!"                    |
| **With todos** | List of todo cards with checkbox, title, edit/delete buttons    |
| **Editing**    | Todo card transforms into title input + description textarea + Save/Cancel buttons |
| **Expanded**   | Description text (or textarea to add one) revealed below the title |

---

### `frontend/src/index.css` — Global Styles

```css
@import "tailwindcss";

:root {
  --bg-color: #0f172a;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-color);
  color: #e2e8f0;
}

* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
```

**What it does:**
- Imports Tailwind CSS
- Sets a dark background (`#0f172a` = slate-900)
- Uses the Inter font (system-ui fallback)
- Global transitions for smooth hover effects

---

### `frontend/vite.config.ts` — Build Configuration

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**What it does:**
- Enables React Fast Refresh via `@vitejs/plugin-react`
- Enables Tailwind CSS processing via `@tailwindcss/vite`

---

## 🔄 Data Flow

```
User interacts with UI (App.tsx)
        │
        ▼
Call to todoService (api.ts)
        │
        ▼
HTTP fetch to http://localhost:3000/todo
        │
        ▼
NestJS TodoController receives request
        │
        ▼
TodoService runs business logic
        │
        ▼
PrismaService queries PostgreSQL
        │
        ▼
Response flows back: DB → Prisma → Service → Controller → HTTP → api.ts → App.tsx → UI
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+)
- PostgreSQL running locally
- A `.env` file in `backend/` with your database URL

### Setup & Run

```bash
# 1. Navigate to the project
cd to-do

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure database connection
# Create backend/.env with:
# DATABASE_URL="postgresql://user:password@localhost:5432/todo_db"

# 4. Run Prisma migrations to create tables
npx prisma migrate dev

# 5. Start the backend (port 3000)
npm run start:dev

# 6. In a new terminal, install & start the frontend
cd ../frontend
npm install
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

### Build for Production

```bash
# From the root to-do/ directory
npm run build:unified
```

This builds the frontend, copies the output into `backend/public`, and builds the NestJS backend — resulting in a single backend server that serves both the API and the static frontend files.

---

## 📝 Summary: What Each Code Snippet Makes Work

| Feature                    | Frontend Code (App.tsx)                       | Backend Endpoint     | Service Method      |
|----------------------------|-----------------------------------------------|----------------------|---------------------|
| Create a todo              | `handleCreateTodo`                            | `POST /todo`         | `create()`          |
| List all todos             | `fetchTodos` / `useEffect` on mount           | `GET /todo`          | `findAll()`         |
| Toggle completed           | `handleToggleComplete`                        | `PATCH /todo/:id`    | `update()`          |
| Edit title/description     | `startEditing` + `handleSaveEdit`             | `PATCH /todo/:id`    | `update()`          |
| Expand/collapse description| `toggleDescription` + `handleSaveDescription` | `PATCH /todo/:id`    | `update()`          |
| Delete a todo              | `handleDeleteTodo`                            | `DELETE /todo/:id`   | `remove()`          |
| Loading spinner            | Ternary in JSX: `loading ? spinner : content` | —                    | —                   |
| Empty state                | `todos.length === 0 ? empty message : list`   | —                    | —                   |
| Validation                 | `!title.trim()` early return                  | `ValidationPipe`     | DTO decorators      |
| Error 404                  | `console.error` in catch blocks               | `NotFoundException`  | `findOne()` check   |