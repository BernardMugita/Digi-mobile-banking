import { useState } from "react";
import "./register.scss";
import { FcMoneyTransfer } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert/alert";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const Navigate = useNavigate();

  const creatUserAccount = async () => {
    if (pin == confirmPin) {
      const userObject = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        username: username,
        pin: pin,
      };
      try {
        const request = await axios.post(
          "http://localhost/server/routes/auth_routes/register_user_routes.php",
          userObject
        );

        if (request.status == 200) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            Navigate("/login");
          }, 3000);
        }
      } catch (error) {
        setError(true);
        console.log(error);
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } else {
      console.log("Your pins do not match!");
    }
  };

  return (
    <div className="Register">
      {success && (
        <Alert message="Account Created Succesfully" status="success" />
      )}
      {error && <Alert message={"Registration Failed!"} status="error" />}
      <span className="logo">
        <FcMoneyTransfer id="logo" />
      </span>
      <div className="register-form">
        <div className="heading">
          <h1>Create Account</h1>
        </div>
        <label>
          <span>First name</span>
          <input type="text" onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          <span>Last name</span>
          <input type="text" onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          <span>Email address</span>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <span>Username</span>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          <span>Enter pin</span>
          <input type="text" onChange={(e) => setPin(e.target.value)} />
        </label>
        <label>
          <span>Confirm pin</span>
          <input type="text" onChange={(e) => setConfirmPin(e.target.value)} />
        </label>
        <button onClick={creatUserAccount}>Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
