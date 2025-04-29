export function extractValueFromBrackets(inputString: string) {
    const regex = /\[([^\]]+)\]/; // Регулярное выражение для поиска текста внутри []
    const match = inputString.match(regex);

    if (match) {
        return match[1]; // Возвращает первую группу захвата
    } else {
        return null; // Возвращает null, если ничего не найдено
    }
}
