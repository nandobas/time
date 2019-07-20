<?php
namespace App\Http\Repositories;

use App\Http\Models\Clube;

class ClubeRepository
{
    public function getClubes(int $intCod=0){
        
        $retorno = new Clube;
        
        if($intCod != 0)              
            $retorno = $retorno->whereRaw("int_cod = {$intCod}");           
        
        $retorno = $retorno->orderBy('updated_at')
                    ->get();

        if($retorno)
            $retorno = $retorno->toArray();

        return $retorno;
    }

    public function SalvarClube($obRequest){

        $obClube = Array(
            'str_nome'=>$obRequest["strNome"],
            'str_escudo'=>$obRequest["strEscudo"],
            'str_mascote'=>$obRequest["strMascote"],
            'str_categoria'=>$obRequest["strCategoria"],
        );

        $clube = new Clube;
        if($obRequest["int_cod"] > 0){
            $clube = Clube::find($obRequest["int_cod"]);
            if($clube == null){
                $clube = new Clube;
            }
        }

        $clube->fill($obClube);

        $clube->save();

        $clube = Clube::where("int_cod", $clube->int_cod)->first();

        return $clube;
    }

    public function RemoverJClube(int $int_cod){

        $clube = Clube::findOrFail($int_cod);
        $clube->delete();
        
    }
}
