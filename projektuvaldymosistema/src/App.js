import './App.css';
import Project from './components/Project';
function App() {
  

  return (
    <div className="App">
      <header className="App-header">
        <div className='ProjectName'>
          <strong>Projektu Valdymo Sistema</strong>
        </div>
      </header>
      <div className='Projects'>
        <Project />
      </div>
    </div>
  );
}

export default App;
