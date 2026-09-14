import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signInSuccess } from "@/redux/user/userSlice";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

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

      const { email, displayName: username, photoURL } = result.user;

      const response = await axios.post(`/api/signin_google/`, {
        name: username,
        email: email,
        photoUrl: photoURL,
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
    <>
      <button
        onClick={handleGoogleClick}
        type="submit"
        className="flex w-full items-center py-2 hover:bg-[#d5d5d526] font-medium text-[#4c4c4c]  px-1 rounded-sm gap-1 justify-center border text-[0.9rem]"
      >
        <img
          className="w-4 object-contain"
          src="/google-signin.png"
          alt="google"
        />
        Continue with Google
      </button>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: "#404040",
            color: "#fff",
          },
        }}
      />
    </>
  );
};

export default OAuth;
