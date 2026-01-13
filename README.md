# Course Master Frontend

A modern, high-performance Learning Management System built with Next.js 16+, TypeScript, Tailwind CSS, and Redux Toolkit.

## 🚀 Features

- **Authentication & Authorization**: Secure login/register with JWT tokens and role-based access
- **Course Management**: Browse, search, and enroll in course
- **Student Dashboard**: Track progress, view enrollments, complete lessons
- **Admin Panel**: Complete course management, analytics, and student oversight
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies
- **Type Safety**: Full TypeScript implementation

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📁 Project Structure

```
course-master-frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── enrollments/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (admin)/
│   │   │   ├── admin/page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── label.tsx
│   ├── lib/
│   │   ├── Provider.tsx
│   │   ├
│   │   |
|   |   |__utils
|   |   |
|___|redux/
│   │   │   ├── features/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── courseSlice.ts
│   │   │   │   ├── enrollmentSlice.ts
│   │   │   │   └── uiSlice.ts
│   │   │   ├── store.ts
│   │   │   ├── hooks.ts
│   │   │
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🛠️ Installation

### Prerequisites

- Node.js 20+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Setup Steps

1. **Clone or create the project**:

```bash
git clone https://github.com/rasel739/course-master-frontend.git
cd course-master-frontend
```

2. **Install dependencies**:

```bash
yarn install

```

3. **Create environment file** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. **Copy all the provided code files** into their respective locations

5. **Run the development server**:

```bash
yarn dev
```

6. **Open your browser**:

```
http://localhost:3000
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🔐 Authentication

### Student Registration

- Navigate to `/register`
- Fill in name, email, and password
- Leave registration key empty

### Login

- Navigate to `/login`
- Enter email and password
- Redirects to dashboard on success

## 🎨 Key Features by Role

### Student Features

- ✅ Browse and search courses
- ✅ View course details with modules and lessons
- ✅ Enroll in courses
- ✅ Track learning progress
- ✅ Mark lessons as complete
- ✅ View personal dashboard

### Admin Features

- ✅ Complete course management (CRUD)
- ✅ Module and lesson management
- ✅ View all student enrollments
- ✅ Analytics dashboard
- ✅ Platform statistics

## 🔧 Configuration

### Tailwind CSS

Configured with custom colors and compatibility. See `tailwind.config.js`.

### Axios Interceptors

- Automatically adds JWT token to requests
- Handles token refresh on 401 errors
- Centralized error handling

### Redux State

- **auth**: User authentication state
- **course**: Course browsing and details
- **enrollment**: Student enrollments and progress
- **ui**: UI state (sidebar, theme)

## 🚦 Routing

### Public Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Student/Admin)

- `/dashboard` - User dashboard
- `/course` - Browse courses
- `/course/[id]` - Course details
- `/enrollments` - My enrollments
- `/enrollments/[id]` - Enrollment details

### Admin Only Routes

- `/admin` - Admin dashboard
- `/admin/course` - Course management
- `/admin/students` - Student management
- `/admin/analytics` - Platform analytics

## 🎯 Next Steps

### Additional Features to Implement

1. **Assignment Submission** (`/admin/assignments`)
2. **Quiz Taking** (`/admin/quizzes`)
3. **Video Player** (integrate video.js or similar)
4. **File Upload** (for assignments)
5. **Real-time Notifications** (Socket.io)
6. **Certificate Generation**
7. **Payment Integration**
8. **Advanced Search & Filters**

## 📚 API Integration

All API calls are centralized in `src/helpers/axios/api.ts`:

- **Auth API**: Login, Register, Logout, Get User
- **Course API**: Get Courses, Get Course by ID
- **Student API**: Enroll, Dashboard, Mark Complete, Submit Assignment/Quiz
- **Admin API**: Full CRUD for courses, modules, lessons, assignments, quizzes

## 🐛 Troubleshooting

### CORS Issues

Make sure your backend has proper CORS configuration:

```typescript
cors: {
  origin: ['http://localhost:3000'],
  credentials: true
}
```

### Authentication Errors

- Check if cookies are being set properly
- Verify JWT tokens in browser DevTools
- Ensure middleware is protecting routes correctly

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT

## 👨‍💻 Author

**Rasel Hossain**
