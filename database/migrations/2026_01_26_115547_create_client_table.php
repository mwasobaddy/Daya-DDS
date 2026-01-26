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
        Schema::create('client', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('business_name');
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->unique();

            $table->unsignedBigInteger('country_id')->constrained('countries')->onDelete('cascade');
            $table->unsignedBigInteger('county_id')->constrained('counties')->onDelete('cascade');
            $table->unsignedBigInteger('subcounty_id')->constrained('subcounties')->onDelete('cascade');
            $table->unsignedBigInteger('ward_id')->constrained('wards')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client');
    }
};
