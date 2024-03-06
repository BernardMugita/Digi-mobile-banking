import axios from "axios";
import { FC, useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../Context/authContext";
import Alert from "../../components/Alert/alert";
import "./change_pin.scss";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";

type Props = object;

type User = {
  success: boolean;
  token: string;
};

const ChangePin: FC<Props> = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { user } = useContext(AuthContext);
  const token = (user as User).token;

  const changePin = async () => {
    try {
      if (newPin == confirmNewPin) {
        const request = await axios.post(
          "http://localhost/server/routes/user_routes/change_pin_route.php",
          {
            newPin,
            oldPin,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (request.status == 200) {
          console.log(request.data);
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        } else {
          console.log("Pins do not match");
        }
      }
    } catch (error) {
      setError(true);
      console.log(error);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <div className="ChangePin">
      <TestimonialWidget />
      {success && <Alert message="Succesfully changed Pin" status="success" />}
      {error && <Alert message={"Failed! Pin not changed"} status="error" />}
      <div className="form">
        <h4>
          Change your account's pin, do not share it with anyone to keep your
          account safe
        </h4>
        <label id="password">
          <span>Old Pin</span>
          <input
            type={!showPassword ? "password" : "text"}
            onChange={(e) => setOldPin(e.target.value)}
          />
          {!showPassword ? (
            <FaEye id="eye" onClick={() => setShowPassword(true)} />
          ) : (
            <FaEyeSlash id="eye" onClick={() => setShowPassword(false)} />
          )}
        </label>
        <label id="password">
          <span>New Pin</span>
          <input
            type={!showPassword ? "password" : "text"}
            onChange={(e) => setNewPin(e.target.value)}
          />
          {!showPassword ? (
            <FaEye id="eye" onClick={() => setShowPassword(true)} />
          ) : (
            <FaEyeSlash id="eye" onClick={() => setShowPassword(false)} />
          )}
        </label>
        <label id="password">
          <span>Confirm new Pin</span>
          <input
            type={!showPassword ? "password" : "text"}
            onChange={(e) => setConfirmNewPin(e.target.value)}
          />
          {!showPassword ? (
            <FaEye id="eye" onClick={() => setShowPassword(true)} />
          ) : (
            <FaEyeSlash id="eye" onClick={() => setShowPassword(false)} />
          )}
        </label>
        <button onClick={changePin}>Change Pin</button>
      </div>
    </div>
  );
};

export default ChangePin;
