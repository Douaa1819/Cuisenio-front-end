import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import PrivateRoute from "./components/PrivateRoute"
import PublicRoute from "./components/PublicRoute"
import { NotificationProvider } from "./context/NotificationContext"
import { ThemeProvider } from "./hooks/use-theme"
import { I18nProvider } from "./context/I18nContext"
import { Role } from "./types/auth.types"
import { InstallPrompt } from "./components/pwa/InstallPrompt"
import { CookieBanner } from "./components/legal/CookieBanner"

// ── Lazy-loaded pages for better performance (code splitting) ─────────────────
const LandingPage      = lazy(() => import("./pages/LandingPage"))
const Login            = lazy(() => import("./pages/auth/Login"))
const Register         = lazy(() => import("./pages/auth/Register"))
const ChefDashboard    = lazy(() => import("./pages/dashboard/ChefDashboard"))
const AdminDashboard   = lazy(() => import("./pages/dashboard/AdminDashboard"))
const ProfilePage      = lazy(() => import("./pages/profile/ProfilePage"))
const RecipeEditorPage = lazy(() => import("./pages/recipes/recipe-editor-page"))
const HomePage         = lazy(() => import("./pages/home/HomePage"))
const CommunityPage    = lazy(() => import("./pages/community/community-page"))
const MealPlannerPage  = lazy(() => import("./pages/meal-planner/meal-planner-page"))
const NotFoundPage     = lazy(() => import("./pages/not-found-page"))
const RecipeDetailPage = lazy(() => import("./pages/community/recipe-detail"))
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"))
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPassword"))
const PrivacyPolicyPage = lazy(() => import("./pages/legal/PrivacyPolicyPage"))
const TermsPage = lazy(() => import("./pages/legal/TermsPage"))
const CookiesPolicyPage = lazy(() => import("./pages/legal/CookiesPolicyPage"))
const NewsletterUnsubscribePage = lazy(() => import("./pages/newsletter/NewsletterUnsubscribePage"))

/** Skeleton while lazy route chunks load — follows active theme tokens. */
const PageLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center bg-background"
    role="status"
    aria-label="Chargement de la page"
  >
    <div className="w-full max-w-md space-y-4 px-6">
      <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-primary/25" />
      <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <I18nProvider>
        <NotificationProvider>
          <Router>
            <InstallPrompt />
            <CookieBanner />
            <Suspense fallback={<PageLoader />}>
              <Routes>
          {/* ── Landing (public) ─────────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribePage />} />

          {/* ── Auth pages: redirect away if already logged in ───────── */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />

          {/* ── Protected pages: any authenticated user ──────────────── */}
          <Route
            path="/chef"
            element={
              <PrivateRoute>
                <ChefDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/discover"
            element={
              <PrivateRoute>
                <CommunityPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/meal-planner"
            element={
              <PrivateRoute>
                <MealPlannerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <PrivateRoute>
                <RecipeEditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-recipe/:id"
            element={
              <PrivateRoute>
                <RecipeEditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipe/:id"
            element={
              <PrivateRoute>
                <RecipeDetailPage />
              </PrivateRoute>
            }
          />

          {/* ── Admin-only ───────────────────────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role={Role.ADMIN}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* ── Legacy alias + fallback ──────────────────────────────── */}
          <Route path="/community" element={<Navigate to="/home" replace />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
