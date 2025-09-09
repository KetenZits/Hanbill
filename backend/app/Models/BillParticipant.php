<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BillParticipant extends Model
{
    protected $fillable = [
        'bill_id',
        'name',
        'email'
    ];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(
            Item::class,
            'item_participants',
            'participant_id',
            'item_id'
        );
    }

    public function paidItems(): HasMany
    {
        return $this->hasMany(Item::class, 'paid_by');
    }
}
