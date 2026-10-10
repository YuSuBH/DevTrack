import { IssueProvider } from './context/IssueContext';

function App() {
  return (
    <IssueProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p className="p-8 text-center text-gray-500">DevTrack — Phase 3 wired ✓</p>
      </div>
    </IssueProvider>
  );
}

export default App;
