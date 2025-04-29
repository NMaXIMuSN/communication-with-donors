import {
  ForbiddenException as _ForbiddenException,
  NotFoundException as _NotFoundException,
  BadRequestException as _BadRequestException,
  InternalServerErrorException as _InternalServerErrorException,
} from '@nestjs/common';

export class ForbiddenException extends _ForbiddenException {
  name: string;
  code: string;

  constructor(message: string = 'Forbidden', code = 'FORBIDDEN') {
    super(message);
    this.name = 'ForbiddenException';
    this.code = code;
  }
}

export class NotFoundException extends _NotFoundException {
  name: string;
  code: string;

  constructor(message: string = 'Not Found', code = 'NOT_FOUNT') {
    super(message);
    this.name = 'NotFoundException';
    this.code = code;
  }
}

export class BadRequestException extends _BadRequestException {
  code: string;

  constructor(message: string = 'Bad Request', code = 'BAD_REQUEST') {
    super(message);
    this.name = 'BadRequestException';
    this.code = code;
  }
}

export class UnknownErrorException extends _InternalServerErrorException {
  code: string;

  constructor(message: string = 'Неизвестная ошибка', code = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'UnknownErrorException';
    this.code = code;
  }
}
