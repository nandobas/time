<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Clubes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clubes', function (Blueprint $table) {
            $table->increments('int_cod');
            $table->string('str_nome', 50);
            $table->string('str_escudo', 100);
            $table->string('str_mascote', 100);
            $table->string('str_categoria', 15);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {            
        Schema::dropIfExists('clubes');
    }
}
