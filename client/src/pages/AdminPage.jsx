import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import UnverifiedUsers from "../components/admin/UnverifiedUsers";
import UserManagement from "../components/admin/UserManagement";
import Reports from "../components/admin/Reports";
import UserHistory from "../components/admin/UserHistory";
import CategoryManagement from "../components/admin/CategoryManagement";

const AdminPage = () => {
  const [selectedTab, setSelectedTab] = useState("unverified"); 

 
  const renderContent = () => {
    switch (selectedTab) {
      case "unverified":
        return <UnverifiedUsers />;
      case "management":
        return <UserManagement />;
      case "history":
        return <UserHistory />;
      case "categories":
        return <CategoryManagement />;
      default:
        return <UnverifiedUsers />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
    
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <div className="p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
