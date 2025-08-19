<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Situation extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_situations';
    protected $primaryKey = 'situation_id';
    protected $fillable = [
        'situation',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'situation_id', 'situation_id');
    }
}