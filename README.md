# Couch Tasks

A modern web application for managing and discovering tasks based on locations. Built with Next.js 15, React 19, and Supabase.

## 🚀 Features

- User authentication and authorization via Supabase
- Location-based task listings with effort levels
- Responsive design with Tailwind CSS
- Server-side rendering with Next.js
- Search functionality for tasks

## 📋 Prerequisites

- Node.js 18.x or higher
- PNPM (recommended) or NPM
- Supabase account for backend services

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd couch_tasks
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the application.

## 📂 Project Structure

```
couch_tasks/
├── app/                 # Next.js app router pages
│   ├── login/           # Authentication pages
│   ├── about/           # About page
│   ├── page.tsx         # Homepage
│   └── layout.tsx       # Root layout
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn UI components
│   ├── header.tsx       # Navigation header
│   ├── listings-grid.tsx # Task listings display
│   └── login-form.tsx   # Authentication form
├── models/              # Type definitions and models
│   └── listing.ts       # Task listing model
├── utils/               # Utility functions
│   └── supabase/        # Supabase client utilities
├── public/              # Static assets
└── lib/                 # Shared libraries
```

## 🧰 Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service (Auth, Database)
- [Shadcn UI](https://ui.shadcn.com/) - Component library

## 🧪 Development

### Code Style

```bash
# Run linting
pnpm lint
```

### Building for Production

```bash
# Create a production build
pnpm build

# Start production server
pnpm start
```

## 🚢 Deployment

### Deploying on Vercel

1. Push your code to a Git repository
2. Import the project to [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

[Specify your license here]

## ✨ Acknowledgments

- Next.js team for the incredible framework
- Vercel for the hosting platform
- Supabase for the backend services
