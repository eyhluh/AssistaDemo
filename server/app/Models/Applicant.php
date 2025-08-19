<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Applicant extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_applicants';
    protected $primaryKey = 'applicant_id';
    protected $fillable = [
        'applicant',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'applicant_id', 'applicant_id');
    }
}