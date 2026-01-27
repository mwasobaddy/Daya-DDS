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
        Schema::table('dcd', function (Blueprint $table) {
            if (!Schema::hasColumn('dcd', 'opening_time')) {
                $table->time('opening_time')->nullable();
            }
            if (!Schema::hasColumn('dcd', 'closing_time')) {
                $table->time('closing_time')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dcd', function (Blueprint $table) {
            if (Schema::hasColumn('dcd', 'opening_time')) {
                $table->dropColumn('opening_time');
            }
            if (Schema::hasColumn('dcd', 'closing_time')) {
                $table->dropColumn('closing_time');
            }
        });
    }
};
