package ro.pie.service;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple5;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.4.1.
 */
@SuppressWarnings("rawtypes")
public class CouponSmartContract extends Contract {
    public static final String BINARY = "608060405234801561001057600080fd5b50610dc8806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806327e235e3146100675780634fb3d3b114610094578063507cd30f146100b8578063a15faa4f146100cd578063ae695c98146100e0578063cf3ea3fb146100f3575b600080fd5b61007a610075366004610b90565b610106565b60405161008b959493929190610cc8565b60405180910390f35b6100a76100a2366004610b90565b61013f565b60405161008b959493929190610c2c565b6100cb6100c6366004610bb1565b610609565b005b61007a6100db366004610bda565b610717565b6100cb6100ee366004610b90565b610762565b6100cb610101366004610b90565b610918565b6000602081905290815260409020805460018201546002830154600384015460049094015492936001600160a01b039092169290919085565b606080606080606061014f61099a565b6000805b6001548110156101cb57876001600160a01b03166001828154811061018857634e487b7160e01b600052603260045260246000fd5b60009182526020909120600160059092020101546001600160a01b031614156101b957816101b581610d37565b9250505b806101c381610d37565b915050610153565b5060008167ffffffffffffffff8111156101f557634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561021e578160200160208202803683370190505b50905060008267ffffffffffffffff81111561024a57634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015610273578160200160208202803683370190505b50905060008367ffffffffffffffff81111561029f57634e487b7160e01b600052604160045260246000fd5b6040519080825280602002602001820160405280156102c8578160200160208202803683370190505b50905060008467ffffffffffffffff8111156102f457634e487b7160e01b600052604160045260246000fd5b60405190808252806020026020018201604052801561031d578160200160208202803683370190505b50905060008567ffffffffffffffff81111561034957634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015610372578160200160208202803683370190505b5090506000955060005b6001548110156105f5578c6001600160a01b0316600182815481106103b157634e487b7160e01b600052603260045260246000fd5b60009182526020909120600160059092020101546001600160a01b031614156105e357600181815481106103f557634e487b7160e01b600052603260045260246000fd5b90600052602060002090600502016000015486888151811061042757634e487b7160e01b600052603260045260246000fd5b6020026020010181815250506001818154811061045457634e487b7160e01b600052603260045260246000fd5b906000526020600020906005020160010160009054906101000a90046001600160a01b031685888151811061049957634e487b7160e01b600052603260045260246000fd5b60200260200101906001600160a01b031690816001600160a01b031681525050600181815481106104da57634e487b7160e01b600052603260045260246000fd5b90600052602060002090600502016002015484888151811061050c57634e487b7160e01b600052603260045260246000fd5b6020026020010181815250506001818154811061053957634e487b7160e01b600052603260045260246000fd5b90600052602060002090600502016003015483888151811061056b57634e487b7160e01b600052603260045260246000fd5b6020026020010181815250506001818154811061059857634e487b7160e01b600052603260045260246000fd5b9060005260206000209060050201600401548288815181106105ca57634e487b7160e01b600052603260045260246000fd5b6020908102919091010152866105df81610d37565b9750505b806105ed81610d37565b91505061037c565b50939b929a50909850965090945092505050565b61061161099a565b6001600160a01b038216600090815260208190526040812060020154610638908390610cf4565b9050600a81106106bd576106b883610651600a84610d52565b61065c600a85610d0c565b6001600160a01b0387166000908152602081905260409020600301546106829190610cf4565b61068d600a86610d0c565b6001600160a01b0388166000908152602081905260409020600401546106b39190610cf4565b6109bc565b610712565b6001600160a01b0383166000908152602081905260409020600201546107129084906106ea908590610cf4565b6001600160a01b038616600090815260208190526040902060038101546004909101546109bc565b505050565b6001818154811061072757600080fd5b6000918252602090912060059091020180546001820154600283015460038401546004909401549294506001600160a01b0390911692909185565b61076a61099a565b6040805160a0810182524281526001600160a01b0383811660208301908152600093830184815260608401858152608085018681526001805480820182559781905295517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf660059098029788015592517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf7870180546001600160a01b0319169190951617909355517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf885015590517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf9840155517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cfa909201919091558054610892908290610d20565b815481106108b057634e487b7160e01b600052603260045260246000fd5b600091825260208083206001600160a01b03948516845290839052604090922060059091029091018054825560018082015490830180546001600160a01b03191691909416179092556002808301549082015560038083015490820155600491820154910155565b61092061099a565b6001600160a01b03811660009081526020819052604090206003015415610062576001600160a01b0381166000908152602081905260409020600281015460039091015461099791839161097690600190610d20565b6001600160a01b0385166000908152602081905260409020600401546109bc565b50565b337368fe8be389f9a77c653bbdfa6c9d24ad36903780146109ba57600080fd5b565b6109c461099a565b6040805160a0810182524281526001600160a01b03868116602083019081529282018681526060830186815260808401868152600180548082018255600082905295517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf660059097029687015595517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf7860180546001600160a01b031916919095161790935590517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf8840155517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf9830155517fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cfa909101558054610ae8908290610d20565b81548110610b0657634e487b7160e01b600052603260045260246000fd5b600091825260208083206001600160a01b03978816845290839052604090922060059091029091018054825560018082015490830180546001600160a01b03191691909716179095556002808601549082015560038086015490820155600494850154940193909355505050565b80356001600160a01b0381168114610b8b57600080fd5b919050565b600060208284031215610ba1578081fd5b610baa82610b74565b9392505050565b60008060408385031215610bc3578081fd5b610bcc83610b74565b946020939093013593505050565b600060208284031215610beb578081fd5b5035919050565b6000815180845260208085019450808401835b83811015610c2157815187529582019590820190600101610c05565b509495945050505050565b600060a08252610c3f60a0830188610bf2565b828103602084810191909152875180835288820192820190845b81811015610c7e5784516001600160a01b031683529383019391830191600101610c59565b50508481036040860152610c928189610bf2565b925050508281036060840152610ca88186610bf2565b90508281036080840152610cbc8185610bf2565b98975050505050505050565b9485526001600160a01b0393909316602085015260408401919091526060830152608082015260a00190565b60008219821115610d0757610d07610d66565b500190565b600082610d1b57610d1b610d7c565b500490565b600082821015610d3257610d32610d66565b500390565b6000600019821415610d4b57610d4b610d66565b5060010190565b600082610d6157610d61610d7c565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fdfea2646970667358221220f92645aa640065b78452726b173f5844be73974af7710435ef0063b36aa792a964736f6c63430008010033";

    public static final String FUNC_ADDPOINTS = "addPoints";

    public static final String FUNC_BALANCES = "balances";

    public static final String FUNC_CREATEUSERHISTORY = "createUserHistory";

    public static final String FUNC_GETUSERHISTORY = "getUserHistory";

    public static final String FUNC_HISTORYRECORDS = "historyRecords";

    public static final String FUNC_USECOUPON = "useCoupon";

    @Deprecated
    protected CouponSmartContract(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected CouponSmartContract(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected CouponSmartContract(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected CouponSmartContract(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public RemoteFunctionCall<TransactionReceipt> addPoints(String user, BigInteger amount) {
        final Function function = new Function(
                FUNC_ADDPOINTS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, user), 
                new org.web3j.abi.datatypes.generated.Uint256(amount)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>> balances(String param0) {
        final Function function = new Function(FUNC_BALANCES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>>(function,
                new Callable<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>>() {
                    @Override
                    public Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>(
                                (BigInteger) results.get(0).getValue(), 
                                (String) results.get(1).getValue(), 
                                (BigInteger) results.get(2).getValue(), 
                                (BigInteger) results.get(3).getValue(), 
                                (BigInteger) results.get(4).getValue());
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> createUserHistory(String user) {
        final Function function = new Function(
                FUNC_CREATEUSERHISTORY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, user)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>>> getUserHistory(String user) {
        final Function function = new Function(FUNC_GETUSERHISTORY, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, user)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Address>>() {}, new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<DynamicArray<Uint256>>() {}));
        return new RemoteFunctionCall<Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>>>(function,
                new Callable<Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>>>() {
                    @Override
                    public Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple5<List<BigInteger>, List<String>, List<BigInteger>, List<BigInteger>, List<BigInteger>>(
                                convertToNative((List<Uint256>) results.get(0).getValue()), 
                                convertToNative((List<Address>) results.get(1).getValue()), 
                                convertToNative((List<Uint256>) results.get(2).getValue()), 
                                convertToNative((List<Uint256>) results.get(3).getValue()), 
                                convertToNative((List<Uint256>) results.get(4).getValue()));
                    }
                });
    }

    public RemoteFunctionCall<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>> historyRecords(BigInteger param0) {
        final Function function = new Function(FUNC_HISTORYRECORDS, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}, new TypeReference<Address>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>>(function,
                new Callable<Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>>() {
                    @Override
                    public Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple5<BigInteger, String, BigInteger, BigInteger, BigInteger>(
                                (BigInteger) results.get(0).getValue(), 
                                (String) results.get(1).getValue(), 
                                (BigInteger) results.get(2).getValue(), 
                                (BigInteger) results.get(3).getValue(), 
                                (BigInteger) results.get(4).getValue());
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> useCoupon(String user) {
        final Function function = new Function(
                FUNC_USECOUPON, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(160, user)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    @Deprecated
    public static CouponSmartContract load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new CouponSmartContract(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static CouponSmartContract load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new CouponSmartContract(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static CouponSmartContract load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return new CouponSmartContract(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static CouponSmartContract load(String contractAddress, Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new CouponSmartContract(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<CouponSmartContract> deploy(Web3j web3j, Credentials credentials, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CouponSmartContract.class, web3j, credentials, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<CouponSmartContract> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CouponSmartContract.class, web3j, credentials, gasPrice, gasLimit, BINARY, "");
    }

    public static RemoteCall<CouponSmartContract> deploy(Web3j web3j, TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(CouponSmartContract.class, web3j, transactionManager, contractGasProvider, BINARY, "");
    }

    @Deprecated
    public static RemoteCall<CouponSmartContract> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(CouponSmartContract.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, "");
    }
}
