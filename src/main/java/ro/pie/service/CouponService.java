package ro.pie.service;

import lombok.extern.slf4j.Slf4j;
import nl.flotsam.xeger.Xeger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.pie.exception.CouponException;
import ro.pie.exception.DataNotFoundException;
import ro.pie.model.Coupon;
import ro.pie.model.Customer;
import ro.pie.repository.CouponRepository;
import ro.pie.repository.CustomerRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Service
@Slf4j
public class CouponService {

    @Autowired
    CouponRepository couponRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    SmartContractService smartContractService;

    public Coupon generateCoupon(Long customerId){
        LocalDate now = LocalDate.now();
        Coupon coupon = Coupon.builder()
                .creationDate(Date.from(now.atStartOfDay(ZoneId.systemDefault()).toInstant()))
                .customerId(customerId)
                .used(false)
                .value(100L)
                .code(generateCouponCode())
                .expirationDate(Date.from(now.plusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant())).build();
        return couponRepository.save(coupon);
    }

    public void useCoupon(Long customerId, String couponCode){
        Customer customer = customerRepository.getOne(customerId);
        if(customer == null)
            throw new DataNotFoundException("Customer "+ customerId + " not found");

        Coupon coupon = couponRepository.findByCodeAndCustomerId(couponCode, customerId);
        if(coupon != null){
            if(coupon.getUsed()){
                throw new CouponException("Coupon is already used");
            }
            if(coupon.getExpirationDate().before(new Date())){
                throw new CouponException("Coupon is expired");
            }
            coupon.setUsed(true);
            coupon.setUsedDate(new Date());
            smartContractService.useCoupon(customer.getKey());
            couponRepository.save(coupon);
        }else{
            throw new DataNotFoundException("Coupon "+ couponCode + " not found");
        }
    }

    private String generateCouponCode(){
        String regex = "[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}";
        Xeger generator = new Xeger(regex);
        return generator.generate();
    }
}
