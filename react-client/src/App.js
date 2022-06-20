import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Students } from './components/StudentComponent';
import { Login } from './components/LoginComponent'
import { RequireAuth } from './components/RequireAuth'
import { Footer } from './components/FooterComponent';


function App() {
  return (
    <div className='page'>
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <RequireAuth exact path="/members" component={Students} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
