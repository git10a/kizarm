import { Switch, Route, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { AddRecord } from './pages/AddRecord';
import { EditRecord } from './pages/EditRecord';
import { PublicProfile } from './pages/PublicProfile';
import { Landing } from './pages/Landing';
import { useRecords } from './hooks/useRecords';

function AppInner() {
  const { user, loading: authLoading } = useAuth();
  const recordsCtx = useRecords(user?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center">
        <span className="text-[#FFC200] text-2xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          KIZARM
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/u/:name">
          <Layout><PublicProfile /></Layout>
        </Route>
        <Route><Landing /></Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/u/:name">
        <Layout><PublicProfile /></Layout>
      </Route>
      <Route path="/add">
        <Layout><AddRecord recordsCtx={recordsCtx} /></Layout>
      </Route>
      <Route path="/edit/:id">
        <Layout><EditRecord recordsCtx={recordsCtx} /></Layout>
      </Route>
      <Route path="/">
        <Redirect to={`/u/${user.id}`} />
      </Route>
      <Route>
        <Layout>
          <div className="text-center py-24"><p className="text-[#777]">ページが見つかりません</p></div>
        </Layout>
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
