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
    Schema::create('applications', function (Blueprint $table) {
      $table->id();
      $table->string('first_name', 255);
      $table->string('middle_name')->nullable();
      $table->string('last_name', 255);
      $table->string('email')->nullable();
      $table->string('phone_number')->nullable();
      $table->string('address', 255)->nullable();
      $table->string('zipCode')->nullable();
      $table->string('city')->nullable();
      $table->string('state')->nullable();
      $table->string('gender')->nullable();
      $table->string('dob')->nullable();
      $table->string('income')->nullable();
      $table->string('ssn');
      $table->string('bank_name', 255)->nullable();
      $table->string('has_cards')->nullable();
      $table->string('no_of_cards')->nullable();
      $table->string('card_limit')->nullable();
      $table->string('id_front')->nullable();
      $table->string('id_back')->nullable();
      $table->string('reference')->unique();
      $table->enum('status', [
        'submitted',
        'under_review',
        'more_info_needed',
        'approved',
        'rejected',
        'fund_disbursed',
        'terminated'
      ])->default('submitted');
      $table->string('amount_applied')->nullable();
      $table->string('amount_approved')->nullable();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('applications');
  }
};
