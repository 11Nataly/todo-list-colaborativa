import React from "react";

const LogoutButton = ({ onLogout }) => {
  return (
    <div className="flex justify-end">
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
