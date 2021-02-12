package ro.pie.exception;

public class EmailAlreadyExistsException  extends RuntimeException {

    public EmailAlreadyExistsException() {
    }

    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
