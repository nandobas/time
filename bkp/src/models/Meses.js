export default class Meses {
    arMeses = [
        {
            intMes: 0,
            strNome: "Janeiro",
            strAbreviacao: "JAN",
            existe_receita: false
        },
        {
            intMes: 1,
            strNome: "Fevereiro",
            strAbreviacao: "FEV",
            existe_receita: false
        },
        {
            intMes: 2,
            strNome: "Março",
            strAbreviacao: "MAR",
            existe_receita: false
        },
        {
            intMes: 3,
            strNome: "Abril",
            strAbreviacao: "ABR",
            existe_receita: false
        },
        {
            intMes: 4,
            strNome: "Maio",
            strAbreviacao: "MAI",
            existe_receita: false
        },
        {
            intMes: 5,
            strNome: "Junho",
            strAbreviacao: "JUN",
            existe_receita: false
        },
        {
            intMes: 6,
            strNome: "Julho",
            strAbreviacao: "JUL",
            existe_receita: false
        },
        {
            intMes: 7,
            strNome: "Agosto",
            strAbreviacao: "AGO",
            existe_receita: false
        },
        {
            intMes: 8,
            strNome: "Setembro",
            strAbreviacao: "SET",
            existe_receita: false
        },
        {
            intMes: 9,
            strNome: "Outubro",
            strAbreviacao: "OUT",
            existe_receita: false
        },
        {
            intMes: 10,
            strNome: "Novembro",
            strAbreviacao: "NOV",
            existe_receita: false
        },
        {
            intMes: 11,
            strNome: "Dezembro",
            strAbreviacao: "DEZ",
            existe_receita: false
        }
    ];

    obterArrayDozeMeses(intMes) {
        return this.arrMeses
            .slice(intMes - 1, 12)
            .concat(this.arrMeses.slice(0, intMes));
    }

    obterPorInicio(intMes) {
        return this.arMeses.slice(intMes, 12);
    }
}
