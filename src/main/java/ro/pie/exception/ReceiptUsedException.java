package ro.pie.exception;

public class ReceiptUsedException  extends RuntimeException {

    public ReceiptUsedException() {
    }

    public ReceiptUsedException(String message) {
        super(message);
    }
}