import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext.jsx';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="app-shell app-shell--app">
          <AppRoutes />
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;