package ro.pie.service;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import lombok.extern.slf4j.Slf4j;
import nl.flotsam.xeger.Xeger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import ro.pie.dto.CouponDto;
import ro.pie.exception.CouponException;
import ro.pie.exception.DataNotFoundException;
import ro.pie.model.Coupon;
import ro.pie.model.Customer;
import ro.pie.model.Shop;
import ro.pie.repository.CouponRepository;
import ro.pie.repository.CustomerRepository;
import ro.pie.repository.ShopRepository;
import ro.pie.util.CampaignType;
import ro.pie.util.CouponTransformer;
import ro.pie.util.UserType;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class CouponService {

    @Autowired
    CouponRepository couponRepository;

    @Autowired
    ShopRepository shopRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    MailjetService mailjetService;

    @Autowired
    SmartContractService smartContractService;

    public Coupon generateCoupon(Long customerId, Long value){
        LocalDate now = LocalDate.now();
        Coupon coupon = Coupon.builder()
                .creationDate(Date.from(now.atStartOfDay(ZoneId.systemDefault()).toInstant()))
                .customerId(customerId)
                .used(false)
                .value(value)
                .code(generateCouponCode())
                .expirationDate(Date.from(now.plusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant())).build();
        return couponRepository.save(coupon);
    }

    public void useCoupon(String email, String couponCode, Long adminId){
        Customer admin = customerRepository.getOne(adminId);
        Customer customer = customerRepository.findByEmail(email);
        if(customer == null)
            throw new DataNotFoundException("Customer "+ email + " not found");
        Shop shop = shopRepository.getOne(admin.getShopId());
        Coupon coupon = couponRepository.findByCodeAndCustomerId(couponCode, customer.getId());
        if(coupon != null){
            if(coupon.getUsed()){
                throw new CouponException("Coupon is already used");
            }
            if(coupon.getExpirationDate().before(new Date())){
                throw new CouponException("Coupon is expired");
            }
            coupon.setUsed(true);
            coupon.setUsedDate(new Date());
            coupon.setShopId(shop.getId());
            smartContractService.useCoupon(customer.getKey());
            couponRepository.save(coupon);
        }else{
            throw new DataNotFoundException("Coupon "+ couponCode + " not found");
        }
    }

    public List<CouponDto> getCustomerCoupons(Long customerId){
        CouponTransformer couponTransformer = new CouponTransformer();
        List<Coupon> coupons = couponRepository.findAllByCustomerIdOrderByUsedAscCreationDateAsc(customerId);
        return couponTransformer.toDtoList(coupons);
    }

    public Long countCustomerActiveCoupons(Long customerId){
        return couponRepository.countAllByCustomerIdAndUsed(customerId,Boolean.FALSE);
    }

    @Async
    public void generateCampaign(CampaignType campaignType){
        List<Customer> customers = customerRepository.findAllByRole(UserType.user.name());
        customers.forEach(customer -> generateAndSendCampaingEmails(customer, campaignType));
    }

    private void generateAndSendCampaingEmails(Customer customer, CampaignType campaignType){
        Coupon coupon = generateCoupon(customer.getId(),10L);
        try {
            mailjetService.sendCampaign(campaignType.getMailjetId(), customer.getEmail(), customer.getFirstName(),coupon.getCode(), coupon.getExpirationDate(), coupon.getValue());
        } catch (Exception e) {
            e.printStackTrace();
        }
        smartContractService.addPoints(customer.getKey(), 10L);
    }

    public List<String> getCampaigns(){
        List<String> result = new ArrayList<>();
        for(CampaignType campaignType: CampaignType.values()){
            result.add(campaignType.getValue());
        }
        return result;
    }

    private String generateCouponCode(){
        String regex = "[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}";
        Xeger generator = new Xeger(regex);
        return generator.generate();
    }
}
