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
        Schema::table('workshop_reviews', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('workshop_id')->constrained()->nullOnDelete();
            $table->foreignId('ticket_id')->nullable()->after('user_id')->constrained()->nullOnDelete();

            $table->unique('ticket_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workshop_reviews', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
            $table->dropConstrainedForeignId('ticket_id');
        });
    }
};
