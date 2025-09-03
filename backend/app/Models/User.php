<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'userslogin'; // เปลี่ยนตรงนี้

    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
    ];

    // Relations เหมือนเดิม
    public function ownedBills()
    {
        return $this->hasMany(Bill::class, 'owner_id');
    }

    public function bills()
    {
        return $this->belongsToMany(Bill::class, 'bill_participants')
            ->withTimestamps();
    }

    public function paidItems()
    {
        return $this->hasMany(Item::class, 'payer_id');
    }
}
