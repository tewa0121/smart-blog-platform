import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Loader from '../components/common/Loader';
import useAuth from '../hooks/useAuth';

import Landing from '../pages/public/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/public/Home';
import PostDetails from '../pages/public/PostDetails';
import NotFound from '../pages/public/NotFound';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageRoles from '../pages/admin/ManageRoles';
import AllPosts from '../pages/admin/AllPosts';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import EditorDashboard from '../pages/editor/EditorDashboard';
import ReviewQueue from '../pages/editor/ReviewQueue';
import ReviewPost from '../pages/editor/ReviewPost';
import AuthorDashboard from '../pages/author/AuthorDashboard';
import CreatePost from '../pages/author/CreatePost';
import EditPost from '../pages/author/EditPost';
import MyPosts from '../pages/author/MyPosts';
import SubscriberDashboard from '../pages/subscriber/SubscriberDashboard';
import Profile from '../pages/subscriber/Profile';
import MyComments from '../pages/subscriber/MyComments';
import Notifications from '../pages/subscriber/Notifications';

function DashboardHome() {
  const { user } = useAuth();
  if (user.role === 'Admin') return <AdminDashboard />;
  if (user.role === 'Editor') return <EditorDashboard />;
  if (user.role === 'Author' || user.role === 'Contributor') return <AuthorDashboard />;
  return <SubscriberDashboard />;
}

// "/" shows the landing page to guests, and the dashboard to logged-in users
function LandingOrDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingOrDashboard />} />

      {/* Clean pages: no navbar, no search */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Public blog */}
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Every logged-in user */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          <Route path="/dashboard/my-comments" element={<MyComments />} />

          {/* Admin only */}
          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="/dashboard/users" element={<ManageUsers />} />
            <Route path="/dashboard/roles" element={<ManageRoles />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>

          {/* Admin + Editor */}
          <Route element={<ProtectedRoute roles={['Admin', 'Editor']} />}>
            <Route path="/dashboard/all-posts" element={<AllPosts />} />
            <Route path="/dashboard/review" element={<ReviewQueue />} />
            <Route path="/dashboard/review/:id" element={<ReviewPost />} />
          </Route>

          {/* Everyone who writes */}
          <Route element={<ProtectedRoute roles={['Admin', 'Editor', 'Author', 'Contributor']} />}>
            <Route path="/dashboard/create-post" element={<CreatePost />} />
            <Route path="/dashboard/edit-post/:id" element={<EditPost />} />
            <Route path="/dashboard/my-posts" element={<MyPosts />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}