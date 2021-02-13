package ro.pie.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.pie.model.Customer;
import ro.pie.repository.CustomerRepository;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@Service
public class AdminService {

    @Autowired
    CustomerRepository customerRepository;

    private DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

    public String encodeFiscal(Double value, Long adminId){
        Customer customer = customerRepository.getOne(adminId);
        int randomInt = (int)(100 * Math.random());
        String originalInput = customer.getShopId()+" "+Math.floor(value) +" "+ df.format(new Date())+" "+randomInt;
        String firstRoundEncodedString = Base64.getEncoder().encodeToString(originalInput.getBytes());
        return Base64.getEncoder().encodeToString(firstRoundEncodedString.getBytes());
    }
}
