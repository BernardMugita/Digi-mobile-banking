import axios from "axios";

interface LoginResponse {
  success: boolean;
  token: string;
}

export const Login = async (
  username: string,
  pin: string
): Promise<LoginResponse | undefined> => {
  const error = " Invalid login credentials";
  try {
    const loginUser = await axios.post<LoginResponse>(
      "http://localhost/server/routes/auth_routes/sign_in_user.php",
      {
        username,
        pin,
      }
    );
    return loginUser.data;
  } catch (err) {
    console.log(err + error);
  }
};
