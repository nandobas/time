<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Jogador extends Model {

    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'jogadores';
    protected $primaryKey = 'int_cod';
    protected $dates = ['deleted_at'];
    
    protected $fillable = ['int_cod', 'int_cod_clube', 'str_nome', 'int_idade', 'str_posicao', 'str_pais'];

    public function getCreatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }

    public function getUpdatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }
}
