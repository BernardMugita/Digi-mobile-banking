import { FaInfo, FaUser, FaWallet } from "react-icons/fa";
import "./home.scss";
import { FaArrowDownShortWide, FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdClose, MdPassword } from "react-icons/md";
import { Key, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/authContext";
import axios from "axios";
import { Link } from "react-router-dom";
import AccountBalancePopup from "../../components/AccountBalancePopUp/account_balance_popup";
import FinancialAdviceComponent from "../../components/FinancialAdvice/financial_advice_component";
import DepositHistory from "../../components/DepositHistory/deposit_history";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";
import Alert from "../../components/Alert/alert";

type User = {
  success: boolean;
  token: string;
};

type UserDetails = {
  success: boolean;
  user: {
    accountno: string;
    email: string;
    firstname: string;
    lastname: string;
    pin: string;
    role: string;
    user_id: string;
    username: string;
  };
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
  };
};

type Transaction = {
  amount: string;
  deposit_type: string;
  status: string;
  transaction_code: string;
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({});

  const [showPopup, setshowPopup] = useState<boolean>(false);
  const [showAdvice, setShowAdvice] = useState<boolean>(false);

  const token = (user as User).token;
  const [account, setAccount] = useState({});
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const getUserDetails = async () => {
    try {
      const request = await axios.post<User>(
        "http://localhost/server/routes/user_routes/get_user_route.php",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (request.status === 200) {
        setUserDetails(request.data);
      }
    } catch (error) {
      setError(true);
      setMessage("Something went wrong try refreshing the page");
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

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
      } else if (request.status == 404) {
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

  const activateAccount = async () => {
    try {
      const request = await axios.post(
        "http://localhost/server/routes/account_routes/activate_account_route.php",
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
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
    getUserDetails();
    getAccountDetails();
  }, []);

  const transactions = [];

  const separateTransactions =
    account &&
    (account as Account).account &&
    (account as Account).account.transactions
      ? JSON.parse((account as Account).account.transactions)
      : null;

  transactions.push(separateTransactions);

  if (Object.keys(account).length === 0) {
    return (
      <div className="container">
        <div className="activateAccount">
          <h2> Welcome to M-Banking</h2>
          <p>
            Your need to activate your account to continue. Click on the button
            below to proceed
          </p>
          <button onClick={activateAccount}>Activate account</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="Home">
        <TestimonialWidget />
        {showPopup ? (
          <AccountBalancePopup
            token={token}
            onClose={() => setshowPopup(false)}
          />
        ) : null}
        {showAdvice ? <FinancialAdviceComponent /> : null}
        {error && <Alert message={message} status="error" />}
        <div className="top">
          <div className="top-section">
            <div className="user-id">
              <span>
                <FaUser />
              </span>
              <p>
                {userDetails && (userDetails as UserDetails).user?.username}
              </p>
            </div>
            {showAdvice ? (
              <div className="info" onClick={() => setShowAdvice(false)}>
                <MdClose />
              </div>
            ) : (
              <div className="info" onClick={() => setShowAdvice(true)}>
                <FaInfo />
              </div>
            )}
          </div>
          <div className="account-balance">
            <p>Account balance</p>
            <h1>
              KES <span>{(account as Account).account?.balance}</span>
            </h1>
          </div>
        </div>
        <div className="quick-actions">
          <p>M-Banking Services</p>
          <div className="actions">
            <Link to="/deposit" className="action">
              <div className="icon">
                <FaArrowDownShortWide />
              </div>
              <p>Deposit</p>
            </Link>
            <div className="action" onClick={() => setshowPopup(true)}>
              <div className="icon">
                <FaWallet />
              </div>
              <p>Account Balance</p>
            </div>
            <Link to="/change_pin" className="action">
              <div className="icon">
                <MdPassword />
              </div>
              <p>Change Pin</p>
            </Link>
            <Link to="/transfers" className="action">
              <div className="icon">
                <FaMoneyBillTrendUp />
              </div>
              <p>Cheques</p>
            </Link>
          </div>
        </div>
        <p className="dep-head">Your recent Deposits</p>
        <div className="recent-transactions">
          {transactions[0].length == 0 ? (
            <p id="#notice">You have not made any deposits</p>
          ) : (
            transactions[0].map((transaction: Transaction, index: Key) => (
              <DepositHistory transaction={transaction} key={index} />
            ))
          )}
        </div>
      </div>
    );
  }
};

export default Home;
