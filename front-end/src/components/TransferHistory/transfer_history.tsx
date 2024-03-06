import { FC } from "react";
import { GrTransaction } from "react-icons/gr";
import "./transfer_history.scss";

type Props = {
  transfer: object;
};

type Transfer = {
  amount: string;
  check_number: string;
  status: string;
  transaction_type: string;
  transaction_code: string;
};

const TransferHistory: FC<Props> = ({ transfer }) => {
  return (
    <div className="TransferHistory">
      <div className="icon">
        <GrTransaction />
      </div>
      <div className="middle">
        <h3>{(transfer as Transfer).transaction_code}</h3>
        <p>{(transfer as Transfer).amount}</p>
      </div>
      <div className="right">
        <p>{(transfer as Transfer).transaction_type}</p>
      </div>
    </div>
  );
};

export default TransferHistory;
