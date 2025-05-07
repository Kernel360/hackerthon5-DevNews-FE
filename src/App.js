import logo from './logo.svg';
import './App.css';
import { Routes, Route, Outlet } from "react-router-dom";


const Layout = () => {
  return (
    <Container>
      <Nav/>

      <Outlet/>
    </Container>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="join" element={<Join/>}/>
        <Route path="login" element={<Detail/>}/>
      </Route>
    </Routes>
  );
}

export default App;


const Container = styled.main`
position: relative;
min-height: calc(100vh - 250px);
overflow-x: hidden;
display: block;
top: 72px;
padding: 0 calc(3.5vw + 5px);

&:after {
  // background: url("/images/home-background.png") center center / cover no-repeat fixed;
  content: "";
  position: absolute;
  inset: 0;
  opacity: 1;
  z-index: -1;
}
