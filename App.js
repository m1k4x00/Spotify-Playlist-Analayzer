import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login.js';
import Dashboard from './Dashboard.js';

//Parse the code form the searchbar which is returned when the authentication is succesful.
const code = new URLSearchParams(window.location.search).get('code');

function App() {
  if(code){
    return <Dashboard code = {code}/>  // Displays Dashboard.js if code is not empty 
  }
  return <Login /> //Shows the authentication page if code is not present
}

export default App;
