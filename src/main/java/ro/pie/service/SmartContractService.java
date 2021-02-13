package ro.pie.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.admin.Admin;
import org.web3j.protocol.http.HttpService;
import org.web3j.tuples.generated.Tuple5;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import ro.pie.dto.CustomerHistoricalDataDto;

import javax.transaction.TransactionalException;
import java.math.BigInteger;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
public class SmartContractService {

    private static final String CONTRACT_ADDRESS = "0xDB4a08883b60246e27f49b648726CCFC26560cB5";
    private static final String ADMIN_ACCOUNT = "0x918e3947e1a3d97befc3f51bd8b31416bbdad5f9";
    private static final String ADMIN_PRIVATE_KEY = "0xc41824a1e0e4f987effed5c274735943a36cb370e09be27fbfc058d90d7c49f3";

    private CouponSmartContract smartContract;

    public SmartContractService() {
        ContractGasProvider gasProvider = new StaticGasProvider(BigInteger.valueOf(4_100_000_000L), BigInteger.valueOf(3_000_000));
        Admin web3 = Admin.build(new HttpService());
        Credentials credentials = Credentials.create(ADMIN_PRIVATE_KEY);
        smartContract = CouponSmartContract.load(CONTRACT_ADDRESS, web3, credentials, gasProvider);
    }

    public void addPoints(String publicKey, Long amount){
        try {
            smartContract.addPoints(publicKey,BigInteger.valueOf(amount)).send();
        }catch (Exception e){
            log.error("Failed to update user balance in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }
    }

    public void useCoupon(String publicKey){
        try {
            smartContract.useCoupon(publicKey).send();
        }catch (Exception e){
            log.error("Failed to update user coupons in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }
    }

    public void balances(String publicKey){
        try{
            smartContract.getUserHistory("0xEf14d874222A6802B3b82b690aeFb26dcdeE7D98").send();
        }catch(Exception e){
            log.error("Failed to create user in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }

    }

    public List<CustomerHistoricalDataDto> getCustomerHistoricalData(String publicKey){
        try{
            Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>> tuple = smartContract.getUserHistory(publicKey).send();
            List<CustomerHistoricalDataDto> result = new ArrayList<>();
            for( int i=0; i< tuple.component1().size(); i++){
                result.add(toDto(LocalDateTime.ofInstant(Instant.ofEpochSecond(tuple.component1().get(i).longValue()), ZoneId.systemDefault()),
                        tuple.component3().get(i).longValue(),
                        tuple.component4().get(i).longValue(),
                        tuple.component5().get(i).longValue()));
            }
            return result;
        }catch(Exception e){
            log.error("Failed to create user in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }
    }

    private CustomerHistoricalDataDto toDto(LocalDateTime timestamp, Long points, Long activeCoupons, Long totalCoupons){
        return CustomerHistoricalDataDto.builder()
                .activeCoupons(activeCoupons)
                .points(points)
                .timestamp(timestamp)
                .totalCoupons(totalCoupons).build();
    }

    public void createAccount(String publicKey) {
        try{
            smartContract.createUserHistory(publicKey).send();
        }catch(Exception e){
            log.error("Failed to create user in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }
    }
}
