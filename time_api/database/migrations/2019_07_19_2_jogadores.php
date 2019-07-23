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
            $table->int('int_cod_clube');
            $table->string('str_nome', 50);
            $table->int('int_idade');
            $table->string('str_posicao', 20)->nullable();
            $table->string('str_pais', 15)->nullable();
            $table->timestamp('deleted_at')->nullable();
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
