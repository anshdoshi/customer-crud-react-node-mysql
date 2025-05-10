import React from "react";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { token, logout } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">
          CustomerApp
        </a>
        {token && (
          <button className="btn btn-outline-light ml-auto" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
