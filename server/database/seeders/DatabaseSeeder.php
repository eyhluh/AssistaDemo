<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Crisis;
use App\Models\Situation;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //User::factory()->create([
        //    'name' => 'Test User',
        //    'email' => 'test@example.com',
        //]);
        Situation::factory()->createMany([
            ['situation' => 'Needs Anti-Rabies Treatment'],
            ['situation' => 'Needs Burial Assistance'],
            ['situation' => 'Needs Laboratory/Medical Assessment'],
            ['situation' => 'Needs Specific Medication'],
            ['situation' => 'Needs Financial Assistance'],
            ['situation' => 'Currently Hospitalized'],
            ['situation' => 'Safe, but requires follow-up'],
            ['situation' => 'Other'],
        ]);

        Gender::factory()->createMany([
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Prefer not to say'],
        ]);

        Crisis::factory()->createMany([
            ['crisis' => 'Labatory Exam'],
            ['crisis' => 'Rabies'],
            ['crisis' => 'Burial/Funeral'],
            ['crisis' => 'Medicine Financial'],
            ['crisis' => 'Hospitalized'],
        ]);

        User::factory()->create([
            "first_name" => "Assista", //demo only
            "middle_name" => "",
            "last_name" => "Admin",
            "suffix_name" => null,
            "contact_number" => "09123456789",
            "gmail" => "assista@gmail.com",
            "password" => "admin123"
        ]);

        User::factory(100)->create();
    }
}
