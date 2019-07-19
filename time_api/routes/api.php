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
