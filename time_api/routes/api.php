<?php
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
//prefix para group


/*
Route::middleware(['checkAcesso:admin;acessos'])->group(function () {    
    Route::prefix('acesso')->group(function(){        
        Route::post('salvar', ['uses' => 'AcessoController@salvar']);        
        Route::get('obter/{id}', ['uses' => 'AcessoController@obter']);   
    });
});
*/

Route::middleware('api')->get('/user', function (Request $request) {
    return "teste aqui";//$request->user();
});


//Clubes
Route::middleware('api')->get('/clubes', 'ClubeController@ListarClubes');
Route::middleware('api')->get('/clubes/{int_cod}', 'ClubeController@GetClube');
Route::middleware('api')->post('/salvar_clube/', 'ClubeController@SalvarClube');
Route::middleware('api')->post('/remover_clube/', 'ClubeController@RemoverClube');

//Jogadores
Route::middleware('api')->get('/jogadores', 'JogadorController@ListarJogadores');
Route::middleware('api')->get('/jogadores/{int_cod}', 'JogadorController@GetJogador');
Route::middleware('api')->post('/salvar_jogador/', 'JogadorController@SalvarJogador');
Route::middleware('api')->post('/remover_jogador/', 'JogadorController@RemoverJogador');

//Arquivo
Route::middleware('api')->get('/gera_arquivo_csv', 'FileController@geraArquivoCsv');
