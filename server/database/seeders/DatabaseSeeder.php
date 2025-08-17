<?php

namespace Database\Seeders;

use App\Models\Gender;
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

        Gender::factory()->createMany([
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Prefer not to say'],
        ]);
            
        $birthDate = fake()->date();
        $age = date_diff(date_create($birthDate), date_create('now'))->y;  

        User::factory()->create([
            "first_name" => "Prince Lorenzo",
            "middle_name" => "R",
            "last_name" => "Mentino",
            "suffix_name" => null,
            "gender_id" => Gender::inRandomOrder()->first()->gender_id,
            "birth_date" => $birthDate,
            "age" => $age,
            "gmail" => "Assista@gmail.com",
            "password" => "admin123"
        ]);

        User::factory(100)->create();
    }
}
