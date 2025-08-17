export interface GenderStat {
    gender: string;
    count: number;
}

export interface RecentActivity {
    message: string;
    time: string;
    type: string;
}

export interface SystemStats {
    activeSessions: number;
    newUsersToday: number;
    systemLoad: number;
}

export interface DashboardStats {
    totalUsers: number;
    genderStats: GenderStat[];
    recentActivities: RecentActivity[];
    systemStats: SystemStats;
}

