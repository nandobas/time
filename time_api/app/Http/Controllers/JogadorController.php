<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Services\JogadorService;

class JogadorController extends Controller
{
    private $service;

    public function __construct(JogadorService $service)
    {
        $this->service = $service;
    }

    public function SalvarJogador(Request $obRequest){
        $dados = $obRequest->all();

        $dados["data"]["int_cod_clube"] = $dados["data"]["int_cod_clube"]["key"];
        $retorno = $this->service->SalvarJogador($dados["data"]);
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function ListarJogadoresTime(Request $obRequest){
        $retorno = $this->service->getJogadoresTime($dados["int_cod_clube"]);
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function ListarJogadores(Request $obRequest){
        $retorno = $this->service->ListarJogadores();
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function RemoverJogador(Request $obRequest){
        $dados = $obRequest->all();
        $retorno = $this->service->RemoverJogador($dados["data"]["int_cod"]);        
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

}
