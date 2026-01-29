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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->enum('role', ['admin', 'da', 'dcd']);
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->unique();
            $table->string('national_id')->unique();
            $table->string('dob');
            $table->enum('gender', ['male', 'female']);

            $table->unsignedBigInteger('country_id')->constrained('countries')->onDelete('cascade');
            $table->unsignedBigInteger('county_id')->constrained('counties')->onDelete('cascade');
            $table->unsignedBigInteger('subcounty_id')->constrained('subcounties')->onDelete('cascade');
            $table->unsignedBigInteger('ward_id')->constrained('wards')->onDelete('cascade');

            $table->string('referral_code')->unique();

            $table->enum('wallet_type', ['personal', 'business', 'both']);
            $table->string('wallet_status');
            $table->string('wallet_pin');
            $table->decimal('wallet_balance', 12, 2)->default(0);

            $table->decimal('total_DDS_balance', 12, 2)->default(0);
            $table->decimal('total_DWS_balance', 12, 2)->default(0);

            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
