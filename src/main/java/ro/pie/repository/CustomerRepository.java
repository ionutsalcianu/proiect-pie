package ro.pie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pie.model.Customer;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmailAndIdNot(String email, Long customerId);
    Customer findByEmail(String email);
    List<Customer> findAllByRole(String role);

}
