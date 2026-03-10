import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/forms.css';
import './styles/cards.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
