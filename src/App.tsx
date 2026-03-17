import { Switch, Route } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AddRecord } from './pages/AddRecord';
import { EditRecord } from './pages/EditRecord';
import { PublicProfile } from './pages/PublicProfile';
import { Login } from './pages/Login';
import { useRecords } from './hooks/useRecords';

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const recordsCtx = useRecords(user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <span
          className="text-[#FFC200] text-2xl font-black tracking-widest"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          KIZARM
        </span>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/u/:name">
        <Layout>
          <PublicProfile />
        </Layout>
      </Route>
      <Route>
        {!user ? (
          <Login />
        ) : (
          <Layout>
            <Switch>
              <Route path="/" component={() => <Home recordsCtx={recordsCtx} />} />
              <Route path="/add" component={() => <AddRecord recordsCtx={recordsCtx} />} />
              <Route path="/edit/:id" component={() => <EditRecord recordsCtx={recordsCtx} />} />
              <Route>
                <div className="text-center py-24">
                  <p className="text-[#777]">ページが見つかりません</p>
                </div>
              </Route>
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
