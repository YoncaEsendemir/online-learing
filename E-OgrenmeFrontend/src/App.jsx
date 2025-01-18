import Footer from './components/Footer';
import Header from './components/Header';
import RouterConfig from './config/RouterConfig';
import PageContainer from './container/PageContainer';
import CheckLocalStorage from './components/checkLocalStorageExpiration';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <>
   
      <PageContainer>
        <CheckLocalStorage>
        <RouterConfig />
        </CheckLocalStorage>
      </PageContainer>
    </>
  );
}

export default App;
