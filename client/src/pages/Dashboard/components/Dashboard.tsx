import { useState, useEffect } from "react";
import { BsFileEarmark, BsEnvelope, BsTelephone } from "react-icons/bs";
import StatisticsService from "../../../services/StatisticsService";
import type {
  DashboardStats,
  RecentActivity,
} from "../../../interfaces/StatisticsInterface";
import AddApplicantFormModal from "../../Applicant/components/AddApplicantFormModal";
import { useModal } from "../../../hooks/useModal";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { useRefresh } from "../../../hooks/useRefresf";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";
import { MdAddCircle } from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";

// Main Dashboard component
const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    genderStats: [],
    recentActivities: [],
    systemStats: {
      activeSessions: 0,
      newUsersToday: 0,
      systemLoad: 0,
    },
  });

  // Modal and Toast state management
  const { isOpen, openModal, closeModal } = useModal(false);
  const { message, isFailed, isVisible, showToastMessage, closeToastMessage } =
    useToastMessage("", false, false);
  const { refresh, handleRefresh } = useRefresh(false);
  const { user } = useAuth();

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString(undefined, options));

    fetchDashboardStats();
  }, [refresh]);

  // User name formatting function (similar to AppHeader)
  const handleUserFullNameFormat = () => {
    if (!user) return "";

    let fullName = `${user.user.last_name}, ${user.user.first_name}`;

    if (user.user.middle_name) {
      fullName += ` ${user.user.middle_name.charAt(0)}.`;
    }

    if (user.user.suffix_name) {
      fullName += ` ${user.user.suffix_name}`;
    }

    return fullName;
  };

  // Callback functions for AddApplicantFormModal
  const onApplicantAdded = (message: string) => {
    showToastMessage(message, false);
    handleRefresh();
  };

  const refreshKey = () => {
    handleRefresh();
  };

  const fetchDashboardStats = async () => {
    try {
      console.log("Fetching dashboard stats...");
      const response = await StatisticsService.getDashboardStats();
      console.log("Dashboard response:", response);

      if (response.data.success) {
        setStats({
          totalUsers: response.data.data.total_users,
          genderStats: response.data.data.gender_stats,
          recentActivities: response.data.data.recent_activities,
          systemStats: {
            activeSessions: response.data.data.system_stats.active_sessions,
            newUsersToday: response.data.data.system_stats.new_users_today,
            systemLoad: response.data.data.system_stats.system_load,
          },
        });
      } else {
        console.error("Dashboard API returned success: false", response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set default stats on error
      setStats({
        totalUsers: 0,
        genderStats: [],
        recentActivities: [],
        systemStats: {
          activeSessions: 0,
          newUsersToday: 0,
          systemLoad: 0,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            {/* Left Side - User Information */}
            <div className="flex-1">
              {/* User Welcome Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="space-y-3">
                  {/* Welcome Message */}
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Welcome {handleUserFullNameFormat()}
                    </h2>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <BsEnvelope className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base break-all">
                      {user?.user?.gmail || "No email available"}
                    </span>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center gap-3 text-gray-600">
                    <BsTelephone className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {user?.user?.contact_number ||
                        "No contact number available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Action Button */}
            <div className="flex flex-col items-start lg:items-end gap-4">
              {/* <div className="text-gray-600 font-medium text-sm sm:text-base">
                {currentDate}
              </div> */}

              {/* Apply for Assistance Button */}
              <button
                onClick={() => openModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <MdAddCircle className="w-5 h-5" />
                Apply for Assistance
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Activity Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
              {/* <BsLightningCharge className="w-5 h-5 mr-2" /> */}
              Active / Ongoing Application
            </h3>
            <div className="space-y-4">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map(
                  (activity: RecentActivity, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm sm:text-base">
                          {activity.message}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs sm:text-sm ml-2 flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BsFileEarmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No Active Application</p>
                  <p className="text-sm mt-1">
                    {/* Activities will appear here when available */}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Placeholder for future content */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              Quick Actions
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                <p className="text-blue-600 text-sm mb-3">
                  Get assistance with your application or account
                </p>
                <button
                  onClick={() => openModal()}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                >
                  Start Application →
                </button>
              </div>

              {/* <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">
                  System Status
                </h4>
                <p className="text-green-600 text-sm">
                  All systems operational
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Add Applicant Form Modal */}
      <AddApplicantFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onApplicantAdded={onApplicantAdded}
        refreshKey={refreshKey}
      />

      {/* Toast Message */}
      <ToastMessage
        message={message}
        isFailed={isFailed}
        isVisible={isVisible}
        onClose={closeToastMessage}
      />
    </div>
  );
};

export default Dashboard;
