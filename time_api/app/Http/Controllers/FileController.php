<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Services\JogadorService;

class FileController extends Controller
{
    private $service;

    public function __construct(JogadorService $service)
    {
        $this->service = $service;
    }

    public function geraArquivoCsv(){

        $retorno = $this->service->ListarJogadoresClube();
        if($retorno["status"] !== true)
            return response(json_encode(null),200, ['Content-TYpe' => 'application/json']);
        sleep(3);
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=data.csv');
        $saida = fopen('php://output', 'w');
        fputcsv($saida, array('Codigo', 'Nome', 'Idade', 'Posicao', 'Pais', 'Clube', 'Categoria'));
        foreach($retorno["retorno"] as $linha){
            fputcsv($saida, 
            array(
                $linha->int_cod, $linha->str_nome,$linha->int_idade,
                $linha->str_posicao,$linha->str_pais,$linha->str_nome_clube,$linha->str_categoria)
            );
        }
      
        exit;

    }

}
