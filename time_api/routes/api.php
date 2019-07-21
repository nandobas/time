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
Route::middleware('api')->get('/clubes/{intCod}', 'ClubeController@GetClube');
Route::middleware('api')->post('/salvar_clube/', 'ClubeController@SalvarClube');

/*
Route::put('articles/{id}', 'ArticleController@update');
Route::delete('articles/{id}', 'ArticleController@delete');*/
