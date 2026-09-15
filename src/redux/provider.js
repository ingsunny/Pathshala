"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sessionResolved, signInSuccess } from "./user/userSlice";
import { loadCourses } from "./course/courseSlice";

function SessionBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/session", {
          cache: "no-store",
        });

        if (!active) return;
        if (response.ok) {
          const data = await response.json();
          dispatch(signInSuccess(data.user));
        } else {
          dispatch(sessionResolved());
        }
      } catch (error) {
        if (error.name !== "AbortError") dispatch(sessionResolved());
      }
    }

    loadSession();

    fetch("/api/get_course", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data?.courses) dispatch(loadCourses(data.courses));
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Course loading failed");
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <SessionBootstrap />
      {children}
    </Provider>
  );
}
