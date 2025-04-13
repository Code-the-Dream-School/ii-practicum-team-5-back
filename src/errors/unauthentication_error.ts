import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_error";

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export default UnauthenticatedError;