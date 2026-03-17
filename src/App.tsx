import { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

const AddRecord = lazy(() => import('./pages/AddRecord').then(m => ({ default: m.AddRecord })));
const EditRecord = lazy(() => import('./pages/EditRecord').then(m => ({ default: m.EditRecord })));
const PublicProfile = lazy(() => import('./pages/PublicProfile').then(m => ({ default: m.PublicProfile })));
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));

const LoadingFallback = (
  <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
    <span className="text-[#FFC200] text-2xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
      KIZARM
    </span>
  </div>
);

function AuthenticatedRoutes() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/u/:name">
        <Layout><Suspense fallback={null}><PublicProfile /></Suspense></Layout>
      </Route>
      <Route path="/add">
        <Layout><Suspense fallback={null}><AddRecord /></Suspense></Layout>
      </Route>
      <Route path="/edit/:id">
        <Layout><Suspense fallback={null}><EditRecord /></Suspense></Layout>
      </Route>
      <Route path="/">
        <Redirect to={`/u/${user!.id}`} />
      </Route>
      <Route>
        <Layout>
          <div className="text-center py-24"><p className="text-[#777]">ページが見つかりません</p></div>
        </Layout>
      </Route>
    </Switch>
  );
}

function AppInner() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return LoadingFallback;

  if (!user) {
    return (
      <Suspense fallback={LoadingFallback}>
        <Switch>
          <Route path="/u/:name">
            <Layout><PublicProfile /></Layout>
          </Route>
          <Route><Landing /></Route>
        </Switch>
      </Suspense>
    );
  }

  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
