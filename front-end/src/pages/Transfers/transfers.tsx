import { FC, Key, useContext, useEffect, useState } from "react";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import "./transfers.scss";
import TransferPopUp from "../../components/TransferPopup/transfer_popup";
import { AuthContext } from "../../Context/authContext";
import StopCheckPopUp from "../../components/CancelCheckPopUp/cancel_check_popup";
import axios from "axios";
import TransferHistory from "../../components/TransferHistory/transfer_history";
import Alert from "../../components/Alert/alert";

type Props = object;

type User = {
  success: boolean;
  token: string;
};
type Account = {
  success: boolean;
  message: string;
  account: {
    firstname: string;
    lastname: string;
    accountno: string;
    balance: string;
    transactions: string;
    transfers: string;
  };
};

type Transfer = {
  amount: string;
  check_number: string;
  status: string;
  transaction_type: string;
  transaction_code: string;
};

const Transfers: FC<Props> = () => {
  const [transferMode, setTransferMode] = useState(false);
  const [stopCheck, setStopCheck] = useState(false);
  const { user } = useContext(AuthContext);
  const token = (user as User).token;
  const [account, setAccount] = useState<Account | null>(null);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const getAccountDetails = async () => {
    try {
      const request = await axios.post<Account>(
        "http://localhost/server/routes/account_routes/get_account_balance_route.php",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (request.status === 200 || request.status === 404) {
        setAccount(request.data);
      }
    } catch (error) {
      setError(true);
      setMessage("Something went wrong try refreshing the page");
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  useEffect(() => {
    if (account && account.account && account.account.transfers) {
      const selectedTransfers = JSON.parse(account.account.transfers);
      setTransfers(selectedTransfers);
    }
  }, [account]);

  return (
    <div className="Transfers">
      {transferMode ? (
        <TransferPopUp token={token} onClose={() => setTransferMode(false)} />
      ) : null}
      {stopCheck ? (
        <StopCheckPopUp token={token} onClose={() => setStopCheck(false)} />
      ) : null}
      {error && <Alert message={message} status="error" />}
      <TestimonialWidget />
      <div className="banner">
        <h2>
          Under this section you'll find all your transfers, cash and check.
        </h2>
      </div>
      <div className="transfer-actions">
        <div className="action transfer" onClick={() => setTransferMode(true)}>
          Make Transfer <FaMoneyBillTransfer />
        </div>
        <div className="action" onClick={() => setStopCheck(true)}>
          Cancel check <MdCancel />
        </div>
      </div>
      <div className="transfer-list">
        {transfers.length == 0 ? (
          <p id="notice">You have not transfered money yet</p>
        ) : (
          transfers.map((transfer: Transfer, index: Key) => (
            <TransferHistory transfer={transfer} key={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Transfers;
