<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Simulacao extends Model {

    use SoftDeletes;

    protected $connection = 'mysql';
    protected $table = 'simulacao';
    protected $primaryKey = 'id';
    protected $dates = ['deleted_at'];

    protected $fillable = ['id_usuario', 'strNome', 'jsonSimulacao'];

    public function getCreatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }

    public function getUpdatedAtAttribute($value){
        return \Carbon\Carbon::parse($value)->format('d/m/Y H:i:s');
    }
}
