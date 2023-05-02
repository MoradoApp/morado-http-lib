export class ResponseHttp<T> {
  public data: T;
  public status: number;
  
  constructor(data: T, status: number) {
      this.data = data;
      this.status = status;
  }
}
