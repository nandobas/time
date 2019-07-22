<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Jogadores extends Migration
{
    /**
     * Run the migrations.
     * 
     * php artisan make:migration clube
     * php artisan migrate
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('jogadores', function (Blueprint $table) {
            $table->increments('int_cod');
            $table->foreign('int_cod_clube')->references('int_cod')->on('clubes');
            $table->string('str_nome', 50);
            $table->int('int_idade');
            $table->string('str_posicao', 20);
            $table->string('str_pais', 15);
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
        Schema::dropIfExists('jogadores');
    }
}
