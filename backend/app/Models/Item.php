<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Item extends Model
{
    use HasFactory;

    protected $fillable = ['bill_id', 'name', 'price', 'payer_id', 'split_type'];

    /**
     * ผู้จ่าย (payer) ของ item นี้
     */
    public function paidByParticipant()
    {
        return $this->belongsTo(BillParticipant::class, 'payer_id');
    }

    /**
     * ผู้ที่แชร์จ่าย (split between) ของ item นี้
     */
    public function splitBetweenParticipants()
    {
        return $this->belongsToMany(
            BillParticipant::class,
            'item_participants',
            'item_id',
            'participant_id'
        )->withTimestamps();
    }
}
