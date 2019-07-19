<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\SimulacaoService;

class SimulacaoController extends Controller
{
    private $service;

    public function __construct(SimulacaoService $service)
    {
        $this->service = $service;
    }

    public function SalvarSimulacao(Request $obRequest){
        $dados = $obRequest->all();
        $dados['id_usuario'] = $obRequest->decrypt['id'];

        $retorno = $this->service->SalvarSimulacao($dados);
        return response()->json($retorno);
    }

    public function ListarSimulacoes(Request $obRequest){
        $retorno = $this->service->ListarSimulacoes($obRequest->decrypt['id']);
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

    public function RemoverSimulacao(Request $obRequest){
        $dados = $obRequest->all();
        $retorno = $this->service->RemoverSimulacao($obRequest->decrypt['id'], $dados["id"]);
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

}
