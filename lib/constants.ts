// ============================================================================
// LMS-Z Constants
// Centralized constants for the application
// ============================================================================

// ============================================================================
// FloatingGuide Component
// Used in: components/lms/FloatingGuide.tsx
// Purpose: Student onboarding guide sections displayed on landing page
// ============================================================================
export const FLOATING_GUIDE_SECTIONS = [
  {
    title: "Quick Start",
    icon: "book" as const, // Maps to BookOpen icon
    steps: ["Browse catalog", "Use filters", "View details"],
  },
  {
    title: "Enrollment",
    icon: "shopping_cart" as const, // Maps to ShoppingCart icon
    steps: ["Add to cart", "Secure checkout", "One-click free enrollment"],
  },
  {
    title: "Learning",
    icon: "play_circle" as const, // Maps to PlayCircle icon
    steps: ["'My Learning' dashboard", "Dynamic video player", "Curriculum sidebar"],
  },
];

// ============================================================================
// FloatingGuide Component - Configuration
// Used in: components/lms/FloatingGuide.tsx
// ============================================================================
export const FLOATING_GUIDE_CONFIG = {
  // Only show guide on landing page
  showOnPage: "/",
  // Dialog max width
  dialogMaxWidth: "max-w-md",
  // Button size
  buttonSize: "w-14 h-14",
};

// ============================================================================
// Header Component
// Used in: components/layout/Header.tsx
// ============================================================================
export const HEADER_CONFIG = {
  height: "h-[73px]",
  logoText: "EduStream",
};

// ============================================================================
// Course Categories
// Used in: app/courses/page.tsx
// ============================================================================
export const COURSE_CATEGORIES = [
  "All",
  "Development",
  "Business",
  "Design",
  "Marketing",
  "IT & Software",
];

// ============================================================================
// Cloudinary Upload Configuration
// Used in: components/file-upload.tsx, app/actions/cloudinary.ts
// ============================================================================
export const CLOUDINARY_CONFIG = {
  videoFolder: "lms_videos",
  imageFolder: "lms_images",
  acceptedVideoTypes: {
    "video/*": [".mp4", ".mov", ".mkv", ".webm"],
  },
  acceptedImageTypes: {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  },
};

// ============================================================================
// Video Player Configuration
// Used in: components/lms/VideoPlayer.tsx
// ============================================================================
export const VIDEO_PLAYER_CONFIG = {
  aspectRatio: "aspect-video",
  preload: "metadata",
  controls: true,
};

// ============================================================================
// Cart LocalStorage Key
// Used in: context/CartContext.tsx
// ============================================================================
export const CART_STORAGE_KEY = "edustream-cart";

// ============================================================================
// User Progress Configuration
// Used in: app/actions/course.ts, components/lms/MarkCompleteButton.tsx
// ============================================================================
export const USER_PROGRESS_CONFIG = {
  tableName: "user_progress",
  conflictFields: ["user_id", "lesson_id"],
};

// ============================================================================
// Purchases Table Configuration
// Used in: app/actions/course.ts, app/actions/analytics.ts
// ============================================================================
export const PURCHASES_CONFIG = {
  tableName: "purchases",
  requiredFields: ["user_id", "course_id", "price"],
};

// ============================================================================
// Reviews Configuration
// Used in: app/actions/reviews.ts, components/lms/ReviewsSection.tsx
// ============================================================================
export const REVIEWS_CONFIG = {
  tableName: "reviews",
  requiredFields: ["user_id", "course_id", "rating"],
  maxCommentLength: 1000,
  minRating: 1,
  maxRating: 5,
  // Only users who purchased the course (or instructor) can review
  requirePurchase: true,
};

// ============================================================================
// Admin Navigation
// Used in: components/admin/AdminSidebar.tsx
// ============================================================================
export const ADMIN_NAVIGATION = [
  { name: "Dashboard", href: "/admin", icon: "space_dashboard" },
  { name: "All Courses", href: "/admin/courses", icon: "video_library" },
  { name: "Create Course", href: "/admin/courses/new", icon: "add_circle" },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
  { name: "Guide", href: "/admin/guide", icon: "menu_book" },
];

// ============================================================================
// Admin Routes
// Used in: app/admin/layout.tsx, middleware (if added later)
// ============================================================================
export const ADMIN_ROUTES = [
  "/admin",
  "/admin/courses",
  "/admin/courses/new",
  "/admin/settings",
  "/admin/guide",
];

// ============================================================================
// Auth Pages
// Used in: app/login/page.tsx, app/signup/page.tsx
// ============================================================================
export const AUTH_PAGES = ["/login", "/signup"];

// ============================================================================
// Default Redirect Paths
// Used in: Various authentication and authorization checks
// ============================================================================
export const REDIRECT_PATHS = {
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  admin: "/admin",
  unauthorized: "/unauthorized",
  home: "/",
};
