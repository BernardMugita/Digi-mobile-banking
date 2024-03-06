import React, { FC, useContext, useEffect, useState } from "react";
import "./account.scss";
import { MdAccountCircle, MdInfo } from "react-icons/md";
import TestimonialWidget from "../../components/Testimonial widget/TestimonialWidget";
import { FaTrashCan } from "react-icons/fa6";
import { FcDataConfiguration } from "react-icons/fc";
import { AuthContext } from "../../Context/authContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert/alert";

type Props = object;

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

const Account: FC<Props> = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({});
  const token = (user as User).token;
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

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="Account">
      {error && <Alert message={message} status="error" />}
      <TestimonialWidget />
      <div className="top">
        <div className="left">
          <span>
            <MdAccountCircle />
          </span>
        </div>
        <div className="right">
          <h1>{`${(userDetails as UserDetails).user?.firstname}
            ${(userDetails as UserDetails).user?.lastname}`}</h1>
          <p>{(userDetails as UserDetails).user?.email}</p>
          <p>{(userDetails as UserDetails).user?.username}</p>
        </div>
      </div>
      <div className="middle">
        <p>
          Account info <MdInfo />
        </p>
        <h2>{(userDetails as UserDetails).user?.accountno}</h2>
        <p>Pin: </p>
      </div>
      <div className="bottom">
        <div className="control-center">
          <button id="delete-button">
            <FaTrashCan /> Delete Account
          </button>
          <Link to="/change_pin" id="pin-button">
            <FcDataConfiguration /> Change Pin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
