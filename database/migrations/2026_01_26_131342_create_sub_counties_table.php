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
        Schema::create('sub_counties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('county_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Sub-county/Local Government name
            $table->string('code')->nullable(); // Optional code
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_counties');
    }
};
