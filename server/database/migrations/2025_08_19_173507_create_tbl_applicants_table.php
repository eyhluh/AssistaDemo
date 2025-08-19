<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_applicants', function (Blueprint $table) {
            $table->id('applicant_id'); // Primary key for the applicants table
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable(); // Changed to 55 max length for consistency

            // Personal Details - Foreign Key
            $table->unsignedBigInteger('gender_id');
            $table->date('birth_date');
            $table->integer('age'); // Age is usually calculated from birth_date, but stored if needed

            // Contact Information
            $table->string('contact_number', 20);
            $table->string('gmail', 255)->unique(); // Gmail unique as per controller validation
            $table->string('house_no', 100);
            $table->string('street', 100);
            $table->string('subdivision', 100)->nullable();
            $table->string('barangay', 100);
            $table->string('city', 100);

            // Crisis Details - Foreign Keys
            $table->unsignedBigInteger('crisis_id');
            $table->unsignedBigInteger('situation_id'); // Foreign key for situation

            // Attached File
            $table->string('attached_file', 255)->nullable(); // Stores the filename of the attached file

            // Status field
            $table->boolean('is_deleted')->default(false); // Using boolean for is_deleted

            $table->timestamps(); // Adds created_at and updated_at columns

            // Foreign Key Constraints
            $table->foreign('gender_id')
                ->references('gender_id')
                ->on('tbl_genders') // Assumes 'tbl_genders' table exists with 'gender_id' primary key
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('crisis_id')
                ->references('crisis_id')
                ->on('tbl_crisiss') // Assumes 'tbl_crisiss' table exists with 'crisis_id' primary key
                ->onUpdate('cascade')
                ->onDelete('cascade');
            
            $table->foreign('situation_id')
                ->references('situation_id')
                ->on('tbl_situations') // Assumes 'tbl_situations' table exists with 'situation_id' primary key
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints(); // Disable foreign key checks to safely drop table
        Schema::dropIfExists('tbl_applicants');
        Schema::enableForeignKeyConstraints(); // Re-enable foreign key checks
    }
};
