import { StatusCodes } from "http-status-codes";

export function APIError({
  message,
  status,
  data,
}: {
  message: string;
  status: StatusCodes;
  data?: any[];
}) {
  this.message = message;
  this.status = status;
  this.name = "APIError";
  this.data = data;
}
