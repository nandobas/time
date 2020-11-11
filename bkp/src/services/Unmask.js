export default class Unmask {
    unmask(input) {
        if (typeof input == "string") {
            const thousandFixed = input
                .replace(/(kr|\$|£|€|R)/g, "") // getting rid of currency
                .trim()
                .replace(/(.+)[.,](\d+)$/g, "$1x$2") // stripping number into $1: integer and $2: decimal part and putting it together with x as decimal point
                .replace(/[.,]/g, "") // getting rid of . AND ,
                .replace("x", "."); // replacing x with .

            return parseFloat(thousandFixed); //.toFixed(2);
        }
        return input;
    }
}
