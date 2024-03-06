import { FC, useState } from "react";
import { MdClose } from "react-icons/md";
import "./transfer_popup.scss";
import axios from "axios";
import Alert from "../Alert/alert";

type Props = {
  onClose: () => void;
  token: string;
};

type Transfer = {
  message: string;
  success: boolean;
};

const TransferPopUp: FC<Props> = ({ onClose, token }) => {
  const [amount, setAmount] = useState(0);
  const [transferType, setTransferType] = useState("");
  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState({});

  const transferMoney = async () => {
    try {
      const request = await axios.post<Transfer>(
        "http://localhost/server/routes/account_routes/transfer_money_route.php",
        {
          amount,
          transferType,
          recipientAccountNumber,
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
        setMessage(request.data);
        setTimeout(() => {
          setSuccess(false);
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

  console.log(transferType);

  return (
    <div className="TransferPopUp">
      {success && (
        <Alert message={(message as Transfer).message} status="success" />
      )}
      {error && <Alert message={"Deposit Failed!"} status="error" />}
      <div id="close">
        <MdClose onClick={onClose} />
      </div>
      <div className="transfer-card">
        <label>
          <span>Amount</span>
          <input
            type="text"
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </label>
        <label>
          <span>Receiver ACC Number</span>
          <input
            type="text"
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
          />
        </label>
        <label>
          <span>Transfer type</span>
          <select onChange={(e) => setTransferType(e.target.value)}>
            <option>-- select -- </option>
            <option>Cash</option>
            <option>Check</option>
          </select>
        </label>
        <button onClick={transferMoney}>Transfer</button>
      </div>
    </div>
  );
};

export default TransferPopUp;
