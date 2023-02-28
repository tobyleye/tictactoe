import { useContext } from "react";
import { BsGoogle } from "react-icons/bs";
import { AuthContext } from "./AuthProvider";

export const Signin = () => {
  const { signIn, guestSignIn } = useContext(AuthContext);

  return (
    <div className="grid justify-center gap-3">
      <button
        className="bg-gray-100 rounded text-xl  px-4 py-3 inline-flex items-center text-gray-900 gap-2 hover:bg-gray-300 transition-colors"
        onClick={signIn}
      >
        <span>
          <BsGoogle />
        </span>
        Login with google
      </button>
      <div className="flex justify-center  items-center gap-2">
        <span className="border-b border-gray-300 w-10"></span>or
        <span className="border-b border-gray-300 w-10"></span>
      </div>
      <button className="text-xl" onClick={guestSignIn}>
        Continue as guest
      </button>
    </div>
  );
};
