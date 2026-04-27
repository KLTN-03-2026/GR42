import React from "react";
import ProfileInfo from "../components/ProfileInfo";

const AdminProfilePage = () => {
  const authToken = localStorage.getItem("auth_token");

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileInfo authToken={authToken} />
    </div>
  );
};

export default AdminProfilePage;
