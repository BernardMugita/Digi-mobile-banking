import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Register/register";
import Home from "./Home/home";
import Login from "./Login/login";
import { AuthContext } from "./Context/authContext";
import Deposit from "./pages/Deposit/deposit";
import Footer from "./components/Footer/footer";
import Account from "./pages/Account/account";
import ChangePin from "./pages/ChangePin/change_pin";
import FinancialTips from "./pages/FinancialTips/financial_tips";
import Transfers from "./pages/Transfers/transfers";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/register" element={user ? <Home /> : <Register />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/deposit" element={user ? <Deposit /> : <Login />} />
          <Route path="/account" element={user ? <Account /> : <Login />} />
          <Route
            path="/change_pin"
            element={user ? <ChangePin /> : <Login />}
          />
          <Route path="/tips" element={user ? <FinancialTips /> : <Login />} />
          <Route path="/transfers" element={user ? <Transfers /> : <Login />} />
        </Routes>
        {user ? <Footer /> : null}
      </Router>
    </div>
  );
};

export default App;
