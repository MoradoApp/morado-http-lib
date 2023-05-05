interface Error {
  message: string;
  code: string;
}

export class ErrorResponseHttp {
  public error: Error;
  public status: number;

  constructor(error: Error, status: number) {
    this.error = error;
    this.status = status;
  }
}
