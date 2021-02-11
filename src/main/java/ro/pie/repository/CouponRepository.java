package ro.pie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pie.model.Coupon;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Coupon findByCodeAndCustomerId(String couponCode, Long customerId);
}
