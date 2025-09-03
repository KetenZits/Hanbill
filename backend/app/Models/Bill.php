<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'owner_id'];

    // ✅ คนสร้างบิล
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // ✅ คนที่เข้าร่วมบิล
    public function participants()
    {
        return $this->belongsToMany(User::class, 'bill_participants')
            ->withTimestamps();
    }

    // ✅ รายการในบิล
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
