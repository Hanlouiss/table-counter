"use client";

import { useState } from "react";
import Login from "../components/login";
import AccountActivation from "../components/accountactivation";

type View = "login" | "activation";

export default function Page() {
  const [view, setView] = useState<View>("login");

  if (view === "activation") {
    return (
      <AccountActivation
        onBack={() => setView("login")}
        onDone={() => setView("login")}
      />
    );
  }

  return <Login onActivate={() => setView("activation")} />;
}