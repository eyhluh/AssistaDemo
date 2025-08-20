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
        Schema::table('tbl_users', function (Blueprint $table) {
            // Drop foreign key constraint first
            $table->dropForeign(['gender_id']);

            // Drop columns that should only be in applicants table
            $table->dropColumn([
                'profile_picture',
                'gender_id',
                'birth_date',
                'age'
            ]);

            // Add contact_number field for user registration
            $table->string('contact_number', 20)->after('last_name');

            // Modify gmail field to allow longer emails
            $table->string('gmail', 255)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tbl_users', function (Blueprint $table) {
            // Add back the dropped columns
            $table->string('profile_picture', 255)->nullable()->after('user_id');
            $table->unsignedBigInteger('gender_id')->after('suffix_name');
            $table->date('birth_date')->after('gender_id');
            $table->integer('age')->after('birth_date');

            // Drop the contact_number field
            $table->dropColumn('contact_number');

            // Revert gmail field length
            $table->string('gmail', 55)->change();

            // Re-add foreign key constraint
            $table->foreign('gender_id')
                ->references('gender_id')
                ->on('tbl_genders')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }
};
