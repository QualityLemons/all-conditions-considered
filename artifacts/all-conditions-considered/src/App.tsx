import { type ReactNode } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Advertising from '@/pages/advertising';
import SuggestAShow from '@/pages/suggest-a-show';
import { Header, Footer } from '@/components/site';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/advertising" component={Advertising} />
        <Route path="/advertising/" component={Advertising} />
        <Route path="/advertising/index.html" component={Advertising} />
        <Route path="/suggest-a-show" component={SuggestAShow} />
        <Route path="/suggest-a-show/" component={SuggestAShow} />
        <Route path="/suggest-a-show/index.html" component={SuggestAShow} />
        <Route path="/index.html" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Header />
      <main id="main">
        <Router />
      </main>
      <Footer />
    </WouterRouter>
  );
}

export default App;
