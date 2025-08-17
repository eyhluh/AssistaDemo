<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function test()
    {
        return response()->json([
            'success' => true,
            'message' => 'Statistics controller is working!'
        ]);
    }

    public function dashboard()
    {
        try {
            // Simple test first - just get total users
            $totalUsers = User::where('is_deleted', false)->count();
            
            // Simple gender stats without complex joins
            $maleCount = User::where('is_deleted', false)
                ->whereHas('gender', function($query) {
                    $query->where('gender', 'Male');
                })
                ->count();
                
            $femaleCount = User::where('is_deleted', false)
                ->whereHas('gender', function($query) {
                    $query->where('gender', 'Female');
                })
                ->count();
            
            // Format gender stats
            $genderStats = collect([
                ['gender' => 'Male', 'count' => $maleCount],
                ['gender' => 'Female', 'count' => $femaleCount]
            ]);
            
            // Get recent activities (last 5 users created)
            $recentActivities = User::where('is_deleted', false)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($user) {
                    return [
                        'message' => "User {$user->first_name} {$user->last_name} registered",
                        'time' => $user->created_at->diffForHumans(),
                        'type' => 'registration'
                    ];
                });
            
            // Get system stats
            $systemStats = [
                'active_sessions' => rand(20, 30), // Placeholder
                'new_users_today' => User::where('is_deleted', false)
                    ->whereDate('created_at', today())
                    ->count(),
                'system_load' => rand(60, 80) // Placeholder
            ];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'gender_stats' => $genderStats,
                    'recent_activities' => $recentActivities,
                    'system_stats' => $systemStats
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Dashboard statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function gender()
    {
        try {
            $genderStats = DB::table('tbl_users')
                ->join('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
                ->where('tbl_users.is_deleted', false)
                ->where('tbl_genders.is_deleted', false)
                ->select('tbl_genders.gender', DB::raw('count(*) as count'))
                ->groupBy('tbl_genders.gender_id', 'tbl_genders.gender')
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $genderStats
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Gender statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch gender statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function users()
    {
        try {
            $totalUsers = User::where('is_deleted', false)->count();
            $newUsersToday = User::where('is_deleted', false)
                ->whereDate('created_at', today())
                ->count();
                
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'new_users_today' => $newUsersToday
                ]
            ]);
            
        } catch (\Exception $e) {
            \Log::error('User statistics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
