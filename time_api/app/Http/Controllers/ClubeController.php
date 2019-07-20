<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Services\ClubeService;

class ClubeController extends Controller
{
    private $service;

    public function __construct(ClubeService $service)
    {
        $this->service = $service;
    }

    public function SalvarClube(Request $obRequest){
        $dados = $obRequest->all();

        $retorno = $this->service->SalvarClube($dados);
        return response()->json($retorno);
    }

    public function GetClube(Request $obRequest){
        $intCod = $obRequest['intCod'];
        $retorno = $this->service->GetClube($intCod);
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

    public function ListarClubes(Request $obRequest){
        $retorno = $this->service->ListarClubes();
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

    public function RemoverClube(Request $obRequest){
        $dados = $obRequest->all();
        $retorno = $this->service->RemoverClube($dados["int_cod"]);
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

}
