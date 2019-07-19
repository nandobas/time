<?php
namespace App\Repositories;

use App\Models\Simulacao;

class SimulacaoRepository
{
    public function getSimulacoes($id_usuario, $strNome=""){
        
        $retorno = Simulacao::
                      where('id_usuario', '=', $id_usuario);
        
        if($strNome != "")              
            $retorno = $retorno->whereRaw("strNome like '%".(trim($strNome))."%' ");           
        
        $retorno = $retorno->orderBy('updated_at')
                    ->get();

        if($retorno)
            $retorno = $retorno->toArray();

        return $retorno;
    }

    public function SalvarSimulacao($obRequest){

        $jsonSimulacao = json_encode($obRequest);

        $obSimulacao = Array(
            'id_usuario'=>$obRequest["id_usuario"],
            'strNome'=>$obRequest["strNome"],
            'jsonSimulacao'=>$jsonSimulacao
        );

        $simulacao = new Simulacao;
        if($obRequest["id"] > 0){
            $simulacao = Simulacao::find($obRequest["id"]);
            if($simulacao == null){
                $simulacao = new Simulacao;
            }
        }

        $simulacao->fill($obSimulacao);

        $simulacao->save();

        $simulacao = Simulacao::where("id", $simulacao->id)->first();

        return $simulacao;
    }

    public function RemoverSimulacao($id_usuario, $id){

        $simulacao = Simulacao::findOrFail($id);
        $simulacao->delete();
        
    }
}
