<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained('bills')->onDelete('cascade');
            $table->string('name');        // ชื่อ item เช่น "เบียร์", "ข้าวมันไก่"
            $table->decimal('price', 10, 2);
            $table->foreignId('payer_id')->constrained('users')->onDelete('cascade'); // คนจ่าย
            $table->enum('split_type', ['equal', 'custom'])->default('equal'); // toggle mode
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
