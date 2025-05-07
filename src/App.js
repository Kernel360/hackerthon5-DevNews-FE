import logo from './logo.svg';
import './App.css';
import { Routes, Route, Outlet } from "react-router-dom";
import styled from "styled-components";
import Banner from "./components/Banner";
import MainPage from "./pages/MainPage";
import JoinPage from "./pages/JoinPage";
import LoginPage from "./pages/LoginPage";
import NewsPage from "./pages/NewsPage";
import CompanyPage from "./pages/CompanyPage";
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(null);

const Layout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // localStorage에서 username 불러오기 (로그인 후)
    const username = localStorage.getItem('username');
    if (username) setUser({ username });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Container>
        <Banner />
        <Outlet />
      </Container>
    </UserContext.Provider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<MainPage/>}/>
        <Route path="join" element={<JoinPage/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="news" element={<NewsPage/>}/>
        <Route path="company" element={<CompanyPage/>}/>
      </Route>
    </Routes>
  );
}

const Container = styled.main`
position: relative;
min-height: calc(100vh - 250px);
overflow-x: hidden;
display: block;
/* top: 72px; */
padding: 0 calc(3.5vw + 5px);

&:after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 1;
  z-index: -1;
}`

export default App;
