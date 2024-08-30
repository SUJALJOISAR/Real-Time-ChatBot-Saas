import {Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import { UseAuth } from './context/AuthContext';

function App() {
  // console.log(UseAuth()?.isLoggedIn);// now in 'main.tsx' file whatever components are there can access the authContext . In simple words whatever components mention inside App component including it can access the authcontext
  const auth=UseAuth();
  return (
    <main>
        <Header />
        <Routes>
           <Route path="/" element={<Home/>}  />
           <Route path="/login" element={<Login/>}  />
           <Route path="/signup" element={<Signup/>}  />
           {auth?.isLoggedIn && auth.user && (
            <Route path="/chat" element={<Chat/>}  />
           )}
           <Route path="*" element={<NotFound/>}  />
        </Routes>
    </main>
  );
}

export default App
