import { Switch, Route } from 'wouter';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AddRecord } from './pages/AddRecord';
import { EditRecord } from './pages/EditRecord';
import { PublicProfile } from './pages/PublicProfile';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Switch>
      <Route path="/u/:name">
        <div className="min-h-screen bg-[#F8F8F6] text-[#111]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          <header className="border-b border-[#E8E8E8] bg-white">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <a href="/">
                <span className="flex items-center cursor-pointer">
                  <span className="text-[#FFC200] text-xl font-black tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                    KIZARM
                  </span>
                </span>
              </a>
              <span className="text-[#888] text-xs tracking-wider">公開プロフィール</span>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-4 py-8">
            <PublicProfile />
          </main>
        </div>
      </Route>
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/add" component={AddRecord} />
            <Route path="/edit/:id" component={EditRecord} />
            <Route path="/profile" component={Profile} />
            <Route>
              <div className="text-center py-24">
                <p className="text-[#777]">ページが見つかりません</p>
              </div>
            </Route>
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

export default App;
