import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./socket/SocketProvider";

import { ProtectedRoute } from "./components/ProtectedRoute";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { GroupChatPage } from "./pages/GroupChatPage";
import { MessagesPage } from "./pages/MessagesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}

            <Route
              path="/"
              element={<LandingPage />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/signup"
              element={<SignupPage />}
            />

            {/* Protected Routes */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <DashboardPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/discover"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <DiscoverPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <CommunitiesPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/communities/:groupId"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <GroupChatPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <MessagesPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages/:userId"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <MessagesPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <ProfilePage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <SettingsPage />
                  </SocketProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;