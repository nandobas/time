function formatDate(date) {
    let dia = date.getDate();
    let mes = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
    ][date.getMonth()];
    mes = date.getMonth();
    let ano = date.getFullYear();

    let hora = date.getHours(); // 0-23
    let min = date.getMinutes(); // 0-59

    return `${mes}/${dia}/${ano}`;
}
let options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
    timeZone: "America/Sao_Paulo"
};
let formatter = new Intl.DateTimeFormat("pt-BR", options);

export default {
    name: "Layout",
    props: {
        titulo: {
            type: String,
            required: true
        },
        horario: false
    },
    data() {
        return {
            hoje: new Date()
        };
    },
    filters: {
        date: formatDate,
        date_2: formatter.format
    }
};
