<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Crisis extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'tbl_crisiss';
    protected $primaryKey = 'crisis_id';
    protected $fillable = [
        'crisis',
        'is_deleted',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'crisis_id', 'crisis_id');
    }
}