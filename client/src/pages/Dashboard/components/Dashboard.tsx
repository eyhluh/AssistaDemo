import { useState, useEffect } from "react";
import {
  BsCalendar3,
  BsPeople,
  BsLightningCharge,
  BsBarChart,
  BsGenderMale,
  BsGenderFemale,
  BsPersonPlus,
} from "react-icons/bs";
import StatisticsService from "../../../services/StatisticsService";
import type {
  DashboardStats,
  GenderStat,
  RecentActivity,
} from "../../../interfaces/StatisticsInterface";
import AddApplicantFormModal from "../../Applicant/components/AddApplicantFormModal";
import { useModal } from "../../../hooks/useModal";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { useRefresh } from "../../../hooks/useRefresf";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";

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

  const getGenderCount = (genderName: string) => {
    const gender = stats.genderStats.find(
      (g: GenderStat) => g.gender.toLowerCase() === genderName.toLowerCase()
    );
    return gender ? gender.count : 0;
  };

  const getMaleCount = () => getGenderCount("male");
  const getFemaleCount = () => getGenderCount("female");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right text-gray-600 font-medium">
              {currentDate}
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <BsPersonPlus className="w-4 h-4" />
              Add Applicant
            </button>
          </div>
        </div>
        <p className="text-gray-600">Welcome to your dashboard overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Current Date Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BsCalendar3 className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Current Date</h3>
              <p className="text-2xl font-bold mt-1">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BsPeople className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold mt-1">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Male Users Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BsGenderMale className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Male Users</h3>
              <p className="text-2xl font-bold mt-1">
                {getMaleCount().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Female Users Card */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BsGenderFemale className="w-8 h-8" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Female Users</h3>
              <p className="text-2xl font-bold mt-1">
                {getFemaleCount().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <BsLightningCharge className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map(
                (activity: RecentActivity, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{activity.message}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {activity.time}
                    </span>
                  </div>
                )
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <BsBarChart className="w-5 h-5 mr-2" />
            Quick Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Active Sessions</span>
              <span className="font-semibold text-blue-600">
                {stats.systemStats.activeSessions}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">New Users Today</span>
              <span className="font-semibold text-green-600">
                {stats.systemStats.newUsersToday}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">System Load</span>
              <span className="font-semibold text-yellow-600">
                {stats.systemStats.systemLoad}%
              </span>
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
