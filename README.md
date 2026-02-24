# EduStream - Modern Learning Management System

EduStream is a comprehensive, full-stack Learning Management System (LMS) built with modern web technologies. It provides a robust platform for instructors to create and sell courses, and for students to discover, enroll in, and complete educational content.

## 🚀 Features

### For Students

- **Course Discovery**: Browse and search through a rich catalog of courses.
- **Enrollment & Progress Tracking**: Enroll in courses, track video lesson completely via progress bars, and beautifully mark lessons as complete.
- **Immersive Video Player**: Beautiful custom video integration for lesson consumption.
- **Course Reviews**: Leave ratings and reviews, edit your reviews, and view overall course feedback.
- **Glassmorphic UI**: Enjoy a stunning, modern dark theme (deep blue slate notes) with glassmorphism and smooth micro-animations.

### For Instructors

- **Instructor Dashboard**: Comprehensive dashboard to manage courses, track revenue, and monitor student enrollments.
- **Course Creation & Management**: Seamlessly create courses, organize chapters, and upload video content.
- **Drag & Drop Reordering**: Easily reorder lessons and chapters using intuitive drag-and-drop mechanics.
- **Publishing Workflow**: Keep courses in "Draft" mode while editing, and publish to the world when ready.

### Core Ecosystem

- **Role-Based Authentication**: Secure role-based access control separating Student and Instructor boundaries cleanly.
- **Dark Mode Support**: Deep slate/blue dark theme integration out of the box using Tailwind CSS v4 and Next-Themes.
- **Responsive Layout**: Designed to look and function perfectly across all devices (mobile, tablet, desktop).

## 🛠️ Technology Stack

This application is built entirely on the cutting-edge of the React/Next.js ecosystem:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix UI primitives)
- **Database & Authentication:** [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth SSR)
- **Animations:** `tw-animate-css`
- **Icons:** Material Symbols Outlined & Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Drag & Drop:** `@hello-pangea/dnd`
- **Video Playback:** `react-player`

## 💻 Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **pnpm** (preferred package manager)
- **Supabase Project** (Database and Auth configured)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/edustream-lms.git
    cd edustream-lms
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    _(Note: You will also need to configure your Supabase Database Schema using the tables for `users`, `courses`, `lessons`, `user_progress`, `purchases`, and `reviews`.)_

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

5.  **Open the app:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Philosophy

EduStream goes beyond the standard LMS template by leveraging premium UI/UX aesthetics. The design strictly prioritizes visual excellence utilizing deep space-slate backgrounds (`oklch(0.13 0.028 261)`), vibrant `#3b82f6` blue accents, interactive glassmorphic cards, and high-contrast readable typography for a truly modern, "wow-factor" experience.

## 🛡️ License

This project is licensed under the MIT License.
