export const divideThousandsWith = ({
    number,
    divider = ' ',
}: {
    number: number;
    divider?: string;
}) => {
    if (Math.abs(number) < 9999) {
        return number;
    }
    return number.toLocaleString('en-US').replaceAll(',', divider);
};

export function millisecondsToHours(milliseconds: number) {
    const hours = milliseconds / 1000 / 60 / 60;
    return Math.round(hours);
}

export function hoursToMilliseconds(hours: number) {
    const milliseconds = hours * 60 * 60 * 1000;
    return Math.round(milliseconds);
}

export function millisecondsToDays(milliseconds: number) {
    const days = milliseconds / 1000 / 60 / 60 / 24;
    return Math.round(days);
}
