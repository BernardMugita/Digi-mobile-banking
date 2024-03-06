import { FC, useContext, useState } from "react";
import "./deposit.scss";
import { MdArrowBack } from "react-icons/md";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Context/authContext";
import Alert from "../../components/Alert/alert";

type Props = object;

type User = {
  success: boolean;
  token: string;
};

type Deposit = {
  success: string;
  message: string;
};

const Deposit: FC<Props> = () => {
  const navigate = useNavigate(); // Initialize useHistory hook

  const goBack = () => {
    navigate(-1);
  };

  const [amount, setAmount] = useState(0);
  const [depositType, setDepositType] = useState("");
  const { user } = useContext(AuthContext);
  const token = (user as User).token;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const depositCash = async () => {
    try {
      const request = await axios.post<Deposit>(
        "http://localhost/server/routes/account_routes/deposit_money_route.php",
        {
          amount,
          depositType,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (request.status == 200) {
        setSuccess(true);
        setMessage(request.data.message);
        setTimeout(() => {
          setSuccess(false);
          navigate("/");
        }, 3000);
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
    <div className="Deposit">
      {success && <Alert message={message} status="success" />}
      {error && <Alert message={"Deposit Failed!"} status="error" />}
      <TestimonialWidget />
      <div className="top-section">
        <div className="info">
          <MdArrowBack onClick={goBack} />
        </div>
      </div>
      <div className="intro">
        <h3>
          Deposit any amount of money to your bank from your mobile banking app.
          You can deposit cash or through a cheque.
        </h3>
      </div>
      <div className="deposit-container">
        <label>
          <span>Amount</span>
          <input
            type="text"
            placeholder="KES"
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </label>
        <label>
          <span>Deposit Type</span>
          <select onChange={(e) => setDepositType(e.target.value)}>
            <option>-- select -- </option>
            <option>Cash</option>
            <option>Check</option>
          </select>
        </label>
        <button onClick={depositCash}>Deposit</button>
      </div>
    </div>
  );
};

export default Deposit;
