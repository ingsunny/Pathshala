import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signInSuccess } from "@/redux/user/userSlice";
import toast from "react-hot-toast";
import ExternalImage from "@/components/ExternalImage";

const OAuth = ({ onSuccess, redirectTo = "/dashboard" }) => {
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
        if (onSuccess) await onSuccess(response.data.user);
        else if (redirectTo) router.push(redirectTo);
      }
      // dispatch(signInSuccess(response.data));
    } catch (error) {
      toast.error("Google sign-in could not be completed");
      console.error("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#d8e2dc] bg-white px-4 py-3.5 text-sm font-bold text-[#415048] transition hover:border-[#b7c9be] hover:bg-[#f4f8f5]"
    >
      <ExternalImage
        className="w-4 object-contain"
        src="/google-signin.png"
        alt=""
      />
      Continue with Google
    </button>
  );
};

export default OAuth;
