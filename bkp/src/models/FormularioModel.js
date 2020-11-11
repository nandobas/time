export default class FormularioModel {
    _id = 0;
    blSalvar = false;
    strNome;
    tipoSimulacao = {
        intTipoSimulacao: null,
        intMesInicio: 1,
        intRegime: null,
        estado: null,
        intAnoCompleto: 1
    };
    cnaes = [];
    id_cnaes = [];
    cnaesIncidenciaIpiIss = [];
    blDesatualizado = false;
    blLiberarCampos = false;
    rbt12 = [];
    campos = [];
    escopo = [];
}
