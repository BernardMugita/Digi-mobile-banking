import { FC, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import "./account_balance_popup.scss";
import { FaUser } from "react-icons/fa";
import axios from "axios";

type Props = {
  onClose: () => void;
  token: string;
};

type Account = {
  success: boolean;
  account: {
    firstname: string;
    lastname: string;
    accountno: string;
    balance: string;
  };
};

const AccountBalancePopup: FC<Props> = ({ onClose, token }) => {
  const [account, setAccount] = useState({});

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

      if (request.status == 200) {
        setAccount(request.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(account);

  useEffect(() => {
    getAccountDetails();
  }, []);
  return (
    <div className="AccountBalancePopup">
      <div id="close">
        <MdClose onClick={onClose} />
      </div>
      <div className="balance-card">
        {/* <TestimonialWidget /> */}
        <h3>
          <FaUser />{" "}
          {`${(account as Account).account?.firstname}
            ${(account as Account).account?.lastname}`}
        </h3>
        <div className="acc-no">
          <p>Acc</p>
          <h2>{(account as Account).account?.accountno}</h2>
        </div>
        <span>
          <h4>Balance</h4>
          <h4>
            KES <span>{(account as Account).account?.balance}</span>
          </h4>
        </span>
        <div className="last-deposit">
          <p>Last deposit</p>
          <p>date</p>
        </div>
      </div>
    </div>
  );
};

export default AccountBalancePopup;
