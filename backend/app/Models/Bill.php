<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'owner_id'
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // ลบ relationship เก่านี้ออก!
    // public function participants()
    // {
    //     return $this->belongsToMany(User::class, 'bill_participants')
    //         ->withTimestamps();
    // }

    // ใช้แบบใหม่แทน
    public function participants()
    {
        return $this->hasMany(BillParticipant::class);
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}