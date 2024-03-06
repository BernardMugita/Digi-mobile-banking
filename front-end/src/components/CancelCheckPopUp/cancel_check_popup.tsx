import { FC, useState } from "react";
import { MdClose } from "react-icons/md";
import "./cancel_check_popup.scss";
import axios from "axios";
import Alert from "../Alert/alert";
import { useNavigate } from "react-router-dom";

type Props = {
  onClose: () => void;
  token: string;
};

const StopCheckPopUp: FC<Props> = ({ onClose, token }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [checkNumber, setCheckNumber] = useState("");
  const Navigate = useNavigate();

  const stopCheck = async () => {
    try {
      const request = await axios.post(
        "http://localhost/server/routes/account_routes/stop_check_route.php",
        {
          checkNumber,
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
        setTimeout(() => {
          setSuccess(false);
          Navigate('/transfers')
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
    <div className="StopCheckPopUp">
      {success && <Alert message="Check Cancelled" status="success" />}
      {error && <Alert message={"Process Failed!"} status="error" />}
      <div id="close">
        <MdClose onClick={onClose} />
      </div>
      <div className="stop-card">
        <label>
          <span>Check Number</span>
          <input type="text" onChange={(e) => setCheckNumber(e.target.value)} />
        </label>
        <button onClick={stopCheck}>Stop Check</button>
      </div>
    </div>
  );
};

export default StopCheckPopUp;
