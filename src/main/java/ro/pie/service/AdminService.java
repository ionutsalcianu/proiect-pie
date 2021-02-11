package ro.pie.service;

import org.springframework.stereotype.Service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@Service
public class AdminService {

    private DateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

    public String encodeFiscal(Double value, Long shopId){
        String originalInput = shopId+" "+Math.floor(value) +" "+ df.format(new Date());
        String firstRoundEncodedString = Base64.getEncoder().encodeToString(originalInput.getBytes());
        return Base64.getEncoder().encodeToString(firstRoundEncodedString.getBytes());
    }
}
