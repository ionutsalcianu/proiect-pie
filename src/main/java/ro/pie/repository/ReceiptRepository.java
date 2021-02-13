package ro.pie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pie.model.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt, String> {
}
