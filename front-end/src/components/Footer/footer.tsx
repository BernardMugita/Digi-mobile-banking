import { FC, useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./footer.scss";
import {
  MdAccountCircle,
  MdDashboard,
  MdLogout,
  MdReorder,
  MdTipsAndUpdates,
} from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { AuthContext } from "../../Context/authContext";
import { FcMoneyTransfer } from "react-icons/fc";

type Props = object;

const Footer: FC<Props> = () => {
  const [showMmore, setShowMore] = useState<boolean>(false);
  

  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="Footer">
      <NavLink to="/">
        <MdDashboard id="footer-icon" />
      </NavLink>
      <NavLink to="/transfers">
        <FcMoneyTransfer id="footer-icon" />
      </NavLink>
      <NavLink to="/tips">
        <MdTipsAndUpdates id="footer-icon" />
      </NavLink>
      {showMmore ? (
        <div className="more" onClick={() => setShowMore(false)}>
          <FaChevronDown id="footer-icon" />
        </div>
      ) : (
        <div className="more" onClick={() => setShowMore(true)}>
          <MdReorder id="footer-icon" />
        </div>
      )}
      {showMmore ? (
        <div className="more-tab">
          <Link to="/account" onClick={() => setShowMore(false)}>
            <MdAccountCircle id="footer-icon" /> Account
          </Link>
          <div className="line"></div>
          <div className="logout" onClick={handleLogout}>
            <MdLogout id="footer-icon" /> Logout
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Footer;
