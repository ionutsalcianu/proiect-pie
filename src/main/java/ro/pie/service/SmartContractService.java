package ro.pie.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.admin.Admin;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.gas.StaticGasProvider;

import javax.transaction.TransactionalException;
import java.math.BigInteger;


@Service
@Slf4j
public class SmartContractService {

    private static final String CONTRACT_ADDRESS = "0xD9c04CF816FE1F431b88983a0c9d55CC992d5184";
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

    public void createAccount(String publicKey) {
        try{
            smartContract.createUserHistory(publicKey).send();
        }catch(Exception e){
            log.error("Failed to create user in blockchain");
            throw new TransactionalException("Transaction in blockchain failed", e);
        }
    }


//    public String getAccounts() throws IOException {
////        Web3j web3 = Web3j.build(new HttpService());
//        ContractGasProvider gasProvider;
//        gasProvider = new DefaultGasProvider();
//        Admin web3 = Admin.build(new HttpService());
//        //Accessing to passport service as admin and creating new passport for JOHN_ACCOUNT
//        Credentials credentials = Credentials.create(ADMIN_PRIVATE_KEY);
//        CouponSmartContract couponSmartContract = CouponSmartContract.load(CONTRACT_ADDRESS, web3, credentials, gasProvider);
////        couponSmartContract.mint(ADMIN_ACCOUNT, BigInteger.valueOf(20));
//        //Accessing to passport service as John and read passport
////        Credentials credentials1 = Credentials.create(JOHN_PRIVATE_KEY);
////        PassportService johnPassportService = PassportService.load(CONTRACT_ADDRESS, web3, credentials1, gasProvider);
//        BigInteger balance = null;
//        try {
//            balance = couponSmartContract.balances(ADMIN_ACCOUNT).send();
//        } catch (Exception e) {
//            System.out.println(e.getMessage());
//        }
//        System.out.println("John most recent data: " + balance);
//        return couponSmartContract.balances(ADMIN_ACCOUNT).toString();
//        //tracking by printing all history records:
////        System.out.println("Tracking all history records: ");
////        for (int i = 0; i < couponSmartContract.getHistoryRecordLength().send().intValue(); i++) {
////            Tuple3<BigInteger, String, String> record = couponSmartContract.getHistoryRecord(BigInteger.valueOf(i)).send();
////            System.out.println("********************************");
////            System.out.println("Incident time " + Instant.ofEpochSecond(record.component1().longValue()));
////            System.out.println("Account updated: " + record.component2());
////            System.out.println("Updated passport data: " + record.component3());
////        }
//    }
}
