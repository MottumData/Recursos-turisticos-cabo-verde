import MapView from './pages/mapView';
import './app/globals.css';
import { LanguageProvider } from './components/languageContext';

function App() {
  return (
    <div className="App">
    <LanguageProvider>
      <MapView />
    </LanguageProvider>
    </div>
  );
}

export default App;