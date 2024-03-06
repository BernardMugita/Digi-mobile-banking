import { FC } from "react";
import { GrTransaction } from "react-icons/gr";
import "./deposit_history.scss";

type Props = {
  transaction: object;
};

type Transaction = {
  amount: string;
  deposit_type: string;
  status: string;
  transaction_code: string;
};

const DepositHistory: FC<Props> = ({ transaction }) => {
  return (
    <div className="DepositHistory">
      <div className="icon">
        <GrTransaction />
      </div>
      <div className="middle">
        <h3>{(transaction as Transaction).transaction_code}</h3>
        <p>{(transaction as Transaction).amount}</p>
      </div>
      <div className="right">
        <p>{(transaction as Transaction).deposit_type}</p>
      </div>
    </div>
  );
};

export default DepositHistory;
