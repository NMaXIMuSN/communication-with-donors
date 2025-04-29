// TODO: add to ticket entity, if it will appeare
export const TICKET_NAME = '[A-Z]{2,}-[0-9]{1,}';
export const TIME_HH_MM = '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$';
export const LATIN_NUMBERS_AND_UNDERSCOR = '^([a-zA-Z0-9_]+)$';
export const LATIN_NUMBERS_AND_UNDERSCOR_AND_DASH = '^([a-zA-Z0-9-_—]+)$';
export const LATIN_NUMBERS_AND_DASH = '^([A-Z0-9-]+)$';
export const LATIN_NUMBER_AND_SPACES = '^([a-zA-Z0-9\\s]+)$';
export const CYRILLIC_NUMBER_AND_SPACES = '^([а-яА-Я0-9\\s]+)$';
export const NUMBER = /^([0-9]+)$/;
export const NUMBER_DORTS_AND_PLUS = /^[0-9]+(\.[0-9]+)*\.?\+?$/;
export const EMAIL_REGEXP =
    /^(?![_.-])((?![_.-][_.-])[a-zA-Z\d_.-]){0,63}[a-zA-Z\d]@((?!-)((?!--)[a-zA-Z\d-]){0,63}[a-zA-Z\d]\.){1,2}([a-zA-Z]{2,14}\.)?[a-zA-Z]{2,14}$/;
export const LINK =
    '^(https?:\\/\\/)' + // validate protocol
    '(([a-z\\d]+(?:-[a-z\\d]+)*\\.)+[a-z]{2,}|' + // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // validate port and path
    '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // validate query string
    '(\\#[-a-z\\d_]*)?$'; // validate fragment locator
