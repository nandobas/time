<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Clube extends Model {

    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'clubes';
    protected $primaryKey = 'int_cod';
    protected $dates = ['deleted_at'];

    protected $fillable = ['int_cod', 'str_nome', 'str_escudo', 'str_mascote', 'str_categoria'];

    public function getCreatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }

    public function getUpdatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }
}
