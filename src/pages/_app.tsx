import MapView from './mapView';
import '../app/globals.css';
import { LanguageProvider } from '../components/Utils/languageContext';

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