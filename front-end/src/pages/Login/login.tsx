import { useContext, useState } from "react";
import "./login.scss";
import welcome from "../../src/assets/welcome.png";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Alert from "../../components/Alert/alert";
import { AuthContext } from "../../Context/authContext";

const Login = () => {
  const [username, setUserName] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const { handleLogin, error, setError } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      await handleLogin(username, pin);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError("Something went wrong");
      setLoginError(true);
      console.log(error);
      setTimeout(() => {
        setLoginError(false);
      }, 3000);
    }
  };

  return (
    <div className="Login">
      {success && (
        <Alert message="Login Succesfull. Welcome" status="success" />
      )}
      {loginError && <Alert message={error ? error : ""} status="error" />}
      <div className="top-deco">
        <img src={welcome} alt="" />
        <h4>Welcome back!</h4>
        <p>We missed you. Login into your account</p>
      </div>
      <div className="login-form">
        <label>
          <span>Username</span>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label id="password">
          <span>Pin</span>
          <input
            type={!showPassword ? "password" : "text"}
            onChange={(e) => setPin(e.target.value)}
          />
          {!showPassword ? (
            <FaEye id="eye" onClick={() => setShowPassword(true)} />
          ) : (
            <FaEyeSlash id="eye" onClick={() => setShowPassword(false)} />
          )}
        </label>
        <button onClick={handleSubmit}>Sign In</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
