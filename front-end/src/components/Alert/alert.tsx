import { FaCheck } from "react-icons/fa";
import "./alert.scss";

type Props = {
  message: string;
  status: string;
};

const Alert = (props: Props) => {
  return (
    <div className="Alert">
      <div
        className="left"
        style={
          props.status == "success"
            ? { backgroundColor: "#0008800" }
            : props.status == "error"
            ? { backgroundColor: "red" }
            : undefined
        }
      >
        <FaCheck />
      </div>
      <div
        className="right"
        style={
          props.status == "success"
            ? { borderBottom: "#0008800" }
            : props.status == "error"
            ? { borderBottom: "red" }
            : undefined
        }
      >
        <h4
          style={
            props.status == "success"
              ? { color: "#0008800" }
              : props.status == "error"
              ? { color: "red" }
              : undefined
          }
        >
          {props.message}
        </h4>
      </div>
    </div>
  );
};

export default Alert;
