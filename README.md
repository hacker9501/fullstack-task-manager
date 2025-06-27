# Fullstack Task Manager

Un sistema completo de gestión de tareas construido con TypeScript, siguiendo Clean Architecture y principios SOLID.

## 🏗️ Arquitectura

### Backend (Node.js + Express + MongoDB)
- **Clean Architecture** con separación de capas
- **Domain Layer**: Entidades y repositorios
- **Application Layer**: Casos de uso
- **Infrastructure Layer**: Base de datos y autenticación
- **Interface Layer**: Controladores y rutas

### Frontend (Next.js + TypeScript)
- **Pages Router** con TypeScript
- **Componentes reutilizables**
- **Hooks personalizados** para autenticación
- **Rutas protegidas**

## 🚀 Tecnologías

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- TypeScript
- Zod (validaciones)
- Winston (logging)
- Jest (testing)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Axios
- React Hooks

## 📦 Instalación

### Prerrequisitos
- Node.js 18.18+
- MongoDB (local o Atlas)
- npm o yarn

### 1. Clonar e instalar dependencias
\`\`\`bash
# Instalar dependencias del workspace
npm install

# O instalar individualmente
cd backend && npm install
cd ../frontend && npm install
\`\`\`

### 2. Configurar variables de entorno

#### Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
\`\`\`

#### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 3. Ejecutar el proyecto

#### Opción 1: Ejecutar todo junto
\`\`\`bash
npm run dev
\`\`\`

#### Opción 2: Ejecutar por separado
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs (si Swagger está habilitado)

## 👤 Usuarios de prueba

El sistema creará automáticamente usuarios de prueba:

### Admin
- Email: admin@example.com
- Password: admin123

### Usuario regular
- Email: user@example.com
- Password: user123

## 🧪 Testing

\`\`\`bash
# Ejecutar tests del backend
npm run test:backend

# O desde la carpeta backend
cd backend && npm test
\`\`\`

## 📁 Estructura del proyecto

\`\`\`
fullstack-task-manager/
├── backend/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   ├── application/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   ├── db/
│   │   │   └── auth/
│   │   ├── interfaces/
│   │   │   ├── controllers/
│   │   │   └── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   └── tests/
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   └── utils/
└── README.md
\`\`\`

## 🔐 Autenticación

El sistema usa JWT para autenticación:
1. Login/Register obtiene un token JWT
2. El token se almacena en localStorage
3. Todas las rutas protegidas requieren el token
4. Control de roles: `admin` y `user`

## 📋 Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Login con email/password
- ✅ JWT tokens
- ✅ Rutas protegidas
- ✅ Control de roles

### Gestión de Tareas
- ✅ Crear tareas
- ✅ Listar tareas
- ✅ Editar tareas
- ✅ Eliminar tareas
- ✅ Filtros por estado
- ✅ Asignación de tareas (admin)

## 🐳 Docker (Opcional)

\`\`\`bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Solo la base de datos
docker-compose up mongodb
\`\`\`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License
\`\`\`
