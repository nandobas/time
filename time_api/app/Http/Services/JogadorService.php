<?php

namespace App\Http\Services;
use App\Http\Repositories\JogadorRepository;

class JogadorService
{
    private $repository;

    public function __construct(JogadorRepository $repository)
    {
        $this->repository = $repository;
    }

    public function ListarJogadores()
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->getJogadores();
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function ListarJogadoresTime($int_cod_time)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->getJogadores($int_cod_time);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function GetJogador(int $intCod)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->getJogadores($intCod);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function SalvarJogador($dados)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->SalvarJogador($dados);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function RemoverJogador($int_cod)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->RemoverJogador($int_cod);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }
}