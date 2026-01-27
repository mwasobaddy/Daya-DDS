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
        Schema::create('dcd', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('business_name');
            $table->string('business_address');
            $table->json('business_type');
            $table->json('operating_days');
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->string('foot_traffic_estimate');

            $table->json('campaign_types');
            $table->json('music_preferences')->nullable();
            $table->json('safety_preferences');

            $table->string('qr_code_path');
            $table->string('pdf_guide_path')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dcd');
    }
};
