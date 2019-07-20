<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\JogadorService;

class JogadorController extends Controller
{
    private $service;

    public function __construct(JogadorService $service)
    {
        $this->service = $service;
    }

    public function SalvarJogador(Request $obRequest){
        $dados = $obRequest->all();
        //$dados['id_usuario'] = $obRequest->decrypt['id'];

        $retorno = $this->service->SalvarJogador($dados);
        return response()->json($retorno);
    }

    public function ListarJogadoresTime(Request $obRequest){
        $retorno = $this->service->ListarJogadoresTime();
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

    public function ListarJogadores(Request $obRequest){
        $retorno = $this->service->ListarJogadores();
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

    public function RemoverJogador(Request $obRequest){
        $dados = $obRequest->all();
        $retorno = $this->service->RemoverJogador($dados["int_cod"]);
        return $this->responseJson($retorno['retorno'], $retorno['status'], $retorno['codeHTTP']);
    }

}
