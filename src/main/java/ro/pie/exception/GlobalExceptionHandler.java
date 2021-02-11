package ro.pie.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import ro.pie.dto.ErrorDto;

import javax.transaction.TransactionalException;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(DataNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorDto dataNotFound(DataNotFoundException e){
        return createErrorDto(e, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorDto illegalArgument(IllegalArgumentException e) {
        log.error("Encountered error", e);
        return createErrorDto(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TransactionalException.class)
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorDto internalError(IllegalArgumentException e) {
        log.error("Encountered error", e);
        return createErrorDto(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

//    @ExceptionHandler(IllegalStateException.class)
//    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
//    @ResponseBody
//    public ErrorDto illegalStateOnDecryption(IllegalStateException e) {
//        log.error("Encountered error", e);
//        return createErrorDto(e,HttpStatus.BAD_REQUEST);
//    }

//    @ExceptionHandler(InvalidEmailAddressException.class)
//    @ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
//    @ResponseBody
//    public ErrorDto invalidEmailAddress(InvalidEmailAddressException e){
//        return createErrorDto(e);
//    }



    private ErrorDto createErrorDto(Exception e, HttpStatus status) {
        ErrorDto err = new ErrorDto();
        err.setMessage(e.getMessage());
        err.setErrorCode(status.getReasonPhrase());
        return err;
    }
}
