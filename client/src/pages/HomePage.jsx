import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useMatchStore } from "../store/useMatchStore";
import {Header} from "../components/Header";

const HomePage = () => {
  const { isLoadingUserProfiles, getUserProfiles, userProfiles } = useMatchStore();

  useEffect(() => {
    getUserProfiles();
  }, [getUserProfiles]);

  console.log("User Profiles: ", userProfiles);

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden'>
    <Sidebar />
    <div className='flex-grow flex flex-col overflow-hidden'>
				<Header />
        </div>

    </div>
  );
};
export default HomePage;