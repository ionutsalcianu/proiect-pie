package ro.pie.service;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ro.pie.dto.CustomerDto;
import ro.pie.exception.DataNotFoundException;
import ro.pie.model.Coupon;
import ro.pie.model.Customer;
import ro.pie.repository.CustomerRepository;
import ro.pie.util.UserType;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class CustomerService implements UserDetailsService {

    private static Pattern pattern = Pattern.compile("^(\\d+) [0-9]+(\\.0?)? (\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2}):(\\d{2})$");

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SmartContractService smartContractService;

    @Autowired
    private CouponService couponService;

    @Autowired
    MailjetService mailjetService;

    @SneakyThrows
    public CustomerDto getCustomer(Long customerId){
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if(customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            return CustomerDto.builder().email(customer.getEmail())
                    .firstName(customer.getFirstName())
                    .lastName(customer.getLastName())
                    .id(customer.getId())
                    .key(customer.getKey())
                    .balance(customer.getBalance())
                    .build();
        }
        throw new DataNotFoundException("Customer " + customerId + " not found");
    }

    private String decodeFiscal(String encodedFiscal){
        String firstRoundDecodeString = new String (Base64.getDecoder().decode(encodedFiscal.getBytes()));
        String decodedString = new String(Base64.getDecoder().decode(firstRoundDecodeString.getBytes()));
        Matcher matcher = pattern.matcher(decodedString);
        if(matcher.matches()) {
            return decodedString;
        }
        throw new IllegalArgumentException("Wrong fiscal code");
    }

    public void updateBalance(Long customerId, String encodedFiscal ) throws MailjetSocketTimeoutException, MailjetException {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if(customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            String decodedFiscal = decodeFiscal(encodedFiscal);
            Long nrOfPoints = Math.round(Double.parseDouble(decodedFiscal.split(" ")[1])) / 100;
            Long sum = customer.getBalance() + nrOfPoints;
            if(sum >= 10) {
                customer.setBalance(sum % 10);
                for( int i=0; i < sum / 10; i++){
                    Coupon coupon = couponService.generateCoupon(customerId);
                    mailjetService.sendEmail(customer.getEmail(),customer.getFirstName(),coupon.getValue(), coupon.getCode());
                }
            } else {
                customer.setBalance(sum);
            }
            smartContractService.addPoints(customer.getKey(), nrOfPoints);
            customerRepository.save(customer);
        }else{
            throw new DataNotFoundException("Customer " + customerId + " not found");
        }
    }

    public void createCustomer(CustomerDto customerDto){
        String publicKey = generatePublicKey();
        Customer customer = new Customer();
        customer.setEmail(customerDto.getEmail());
        customer.setFirstName(customerDto.getFirstName());
        customer.setLastName(customerDto.getLastName());
        customer.setBalance(0L);
        customer.setKey(publicKey);
        customer.setRole(UserType.user.name());
        customer.setPassword(passwordEncoder.encode(customerDto.getPassword()));
        customerRepository.save(customer);
        smartContractService.createAccount(publicKey);

    }

    @SneakyThrows
    private String generatePublicKey(){
        byte[] nonce = new byte[20];
        SecureRandom rand = SecureRandom.getInstance("DRBG");
        rand.nextBytes(nonce);
        StringBuilder result = new StringBuilder();
        for (byte temp : nonce) {
            result.append(String.format("%02x", temp));
        }
        return "0x"+result.toString();

    }
    @Override
    public UserDetails loadUserByUsername(String email) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            throw new DataNotFoundException("Customer with email "+ email + " not found");
        }
        return User.withUsername(customer.getEmail()).password(customer.getPassword()).authorities("USER").build();
    }
}
