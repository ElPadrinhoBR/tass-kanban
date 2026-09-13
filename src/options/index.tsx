import { createRoot } from 'react-dom/client';
import '../styles/globals.css';
import { Dashboard } from '../dashboard/Dashboard';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Dashboard />);
}