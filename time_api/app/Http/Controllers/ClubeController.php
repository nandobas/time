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
        $retorno = $this->service->SalvarClube($dados["data"]);
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function GetClube(Request $obRequest){
        $intCod = $obRequest['intCod'];
        $retorno = $this->service->GetClube($intCod);
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function ListarClubes(Request $obRequest){
        $retorno = $this->service->ListarClubes();
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

    public function RemoverClube(Request $obRequest){
        $dados = $obRequest->all();
        $retorno = $this->service->RemoverClube($dados["data"]["int_cod"]);
        
        return response(json_encode($retorno),200, ['Content-TYpe' => 'application/json']);
    }

}
