<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    // Define the table associated with the model.
    // This model will interact with the 'tbl_applications' table in your database.
    protected $table = 'tbl_applications';

    // Define the primary key for the model.
    // The 'application_id' column is specified as the primary key.
    protected $primaryKey = 'application_id';

    /**
     * The attributes that are mass assignable.
     * These fields can be filled using mass assignment (e.g., Application::create()).
     * This includes all the fields from your Crisis Situation Online Registration Form
     * and those handled by the ApplicationController.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // Personal Details
        'first_name',
        'middle_name',
        'last_name',
        'suffix_name',
        'gender_id',     // Foreign key to tbl_genders
        'birth_date',
        'age',           // Calculated in controller, stored here

        // Contact Information
        'contact_number',
        'gmail',
        'house_no',
        'street',
        'subdivision',
        'barangay',
        'city',

        // Crisis Details
        'crisis_id',     // Foreign key to tbl_crisiss
        'situation_id',  // Foreign key to tbl_situations

        // Attached File
        'attached_file', // Stores the filename of the uploaded file

        // Soft Delete Status
        'is_deleted',    // For soft deletion mechanism
    ];

    /**
     * The attributes that should be cast.
     * Define custom type casting for model attributes.
     * For example, 'is_deleted' might be cast to a boolean.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_deleted' => 'boolean',
        'birth_date' => 'date', // Cast birth_date to a Carbon instance
    ];

    /**
     * Get the gender that owns the application.
     * Defines a many-to-one relationship with the Gender model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class, 'gender_id', 'gender_id');
    }

    /**
     * Get the crisis that the application is related to.
     * Defines a many-to-one relationship with the Crisis model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function crisis(): BelongsTo
    {
        return $this->belongsTo(Crisis::class, 'crisis_id', 'crisis_id');
    }

    /**
     * Get the situation that the application is related to.
     * Defines a many-to-one relationship with the Situation model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function situation(): BelongsTo
    {
        return $this->belongsTo(Situation::class, 'situation_id', 'situation_id');
    }
}
