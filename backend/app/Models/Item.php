<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['bill_id', 'name', 'price', 'payer_id', 'split_type'];

    // ✅ บิลที่ item สังกัด
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }

    // ✅ คนจ่าย
    public function payer()
    {
        return $this->belongsTo(User::class, 'payer_id');
    }

    // ✅ ผู้ร่วมรายการนี้
    public function participants()
    {
        return $this->belongsToMany(User::class, 'item_participants')
            ->withPivot('amount')
            ->withTimestamps();
    }
}
