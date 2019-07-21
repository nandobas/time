<?php

namespace App\Http\Services;
use App\Http\Repositories\ClubeRepository;

class ClubeService
{
    private $repository;

    public function __construct(ClubeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function ListarClubes()
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->getClubes();
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function GetClube(int $intCod)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->getClubes($intCod);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function SalvarClube($dados)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->SalvarClube($dados);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }

    public function RemoverClube($int_cod)
    {
        $retorno = [];
        $retorno['retorno'] = $this->repository->RemoverClube($int_cod);
        $retorno['status']=true; 
        $retorno['codeHTTP']=200;
       
       return $retorno; 
    }
}