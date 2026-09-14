import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signInSuccess } from "@/redux/user/userSlice";
import toast from "react-hot-toast";

const OAuth = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Set the custom parameter to prompt user to select an account
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      const response = await axios.post(`/api/signin_google/`, {
        idToken,
      });

      if (response.status === 200) {
        dispatch(signInSuccess(response.data.user));
        toast.success("Login successful");
        router.push("/dashboard");
      }
      // dispatch(signInSuccess(response.data));
    } catch (error) {
      toast.error("Internal Error!");
      console.error("Could not login with Google", error);
    }
  };

  return (
      <button
        onClick={handleGoogleClick}
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <img
          className="w-4 object-contain"
          src="/google-signin.png"
          alt=""
        />
        Continue with Google
      </button>
  );
};

export default OAuth;
