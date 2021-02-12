package ro.pie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pie.model.Coupon;

import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Coupon findByCodeAndCustomerId(String couponCode, Long customerId);

    List<Coupon> findAllByCustomerIdOrderByUsedAscCreationDateAsc(Long customerId);

    Long countAllByCustomerIdAndUsed(Long customerId,Boolean used);

}
