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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('client')->onDelete('cascade');
            $table->foreignId('dcd_id')->constrained('dcd')->onDelete('cascade');
            $table->string('campaign_name');
            $table->string('campaign_type');
            $table->json('music_preferences')->nullable();
            $table->string('digital_product_link');
            $table->string('explainer_video_link')->nullable();
            $table->date('campaign_objectives');
            $table->decimal('budget', 10, 2);
            $table->string('currency');
            $table->json('safety_preferences');

            $table->unsignedBigInteger('country_target')->constrained('countries')->onDelete('cascade');
            $table->unsignedBigInteger('county_target')->nullable()->constrained('counties')->onDelete('cascade');
            $table->unsignedBigInteger('subcounty_target')->nullable()->constrained('subcounties')->onDelete('cascade');
            $table->unsignedBigInteger('ward_target')->nullable()->constrained('wards')->onDelete('cascade');

            $table->json('business_target');
            $table->longText('target_audience')->nullable();
            $table->longText('objectives')->nullable();

            $table->string('status')->default('pending');

            $table->integer('credits_allocated')->default(0);
            $table->integer('credits_balance')->default(0);
            $table->integer('credits_used')->default(0);
            $table->integer('scan_allocated')->default(0);
            $table->integer('scan_balance')->default(0);
            $table->integer('scan_used')->default(0);






            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
