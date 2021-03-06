<?php
namespace App\Http\Repositories;

use App\Http\Models\Jogador;

class JogadorRepository
{
    public function getJogadoresClube(){
        
        $retorno = Jogador
        ::join('clubes', 'clubes.int_cod', '=', 'jogadores.int_cod_clube')
        ->select(
            'jogadores.int_cod', 'jogadores.str_nome', 'int_idade', 'str_posicao', 'str_pais', 
            'clubes.str_nome as str_nome_clube', 'clubes.str_categoria'
        )
        ->whereNull('jogadores.deleted_at')
        ->getQuery()
        ->get();

        if($retorno)
            $retorno = $retorno->toArray();

        return $retorno;
    }

    public function getJogadores(string $strNome=""){
        
        $retorno = new Jogador;
        
        if($strNome != "")              
            $retorno = $retorno->whereRaw("str_nome like '%".(trim($strNome))."%' ");           
        
        $retorno = $retorno->orderBy('updated_at')
                    ->get();

        if($retorno)
            $retorno = $retorno->toArray();

        return $retorno;
    }

    public function SalvarJogador($obRequest){

        $obJogador = Array(
            'int_cod_clube'=>$obRequest["int_cod_clube"],
            'str_nome'=>$obRequest["str_nome"],
            'int_idade'=>$obRequest["int_idade"],
            'str_posicao'=>$obRequest["str_posicao"],
            'str_pais'=>$obRequest["str_pais"],
        );

        $jogador = new Jogador;
        if($obRequest["int_cod"] > 0){
            $jogador = Jogador::find($obRequest["int_cod"]);
            if($jogador == null){
                $jogador = new Jogador;
            }
        }

        $jogador->fill($obJogador);

        $jogador->save();

        $jogador = Jogador::where("int_cod", $jogador->int_cod)->first();

        return $jogador;
    }

    public function RemoverJogador(int $int_cod){

        $jogador = Jogador::findOrFail($int_cod);
        $jogador->delete();
        
    }
}
