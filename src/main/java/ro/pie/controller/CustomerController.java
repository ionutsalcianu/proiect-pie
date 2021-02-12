package ro.pie.controller;

import com.mailjet.client.errors.MailjetException;
import com.mailjet.client.errors.MailjetSocketTimeoutException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ro.pie.dto.BalanceUpdateDto;
import ro.pie.dto.CouponDto;
import ro.pie.dto.CustomerDto;
import ro.pie.dto.ErrorDto;
import ro.pie.service.CouponService;
import ro.pie.service.CustomerService;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost")
@RestController
@RequestMapping("/api/v1/customer-controller")
@Api(value = "customer-controller")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CouponService couponService;

    @GetMapping(value = "/customer", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @ApiOperation(value = "Get customer details based on customer id")
    @ApiResponses({
            @ApiResponse(code = 404, message = "Could not find the requested customer", response = ErrorDto.class),
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public CustomerDto getCustomer(@RequestParam Long customerId) {
        return customerService.getCustomer(customerId);
    }

    @GetMapping(value = "/customer-balance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @ApiOperation(value = "Get customer balance based on customer id")
    @ApiResponses({
            @ApiResponse(code = 404, message = "Could not find the requested customer", response = ErrorDto.class),
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public Long getCustomerBalance(@RequestParam Long customerId) {
        return customerService.getCustomerBalance(customerId);
    }

    @PostMapping(value = "/create-customer", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Create customer")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void createCustomer(@RequestBody CustomerDto customerDto) {
        customerService.createCustomer(customerDto);
    }

    @PutMapping(value = "/update-customer", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Update customer")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void updateCustomer(@RequestBody CustomerDto customerDto, @RequestParam Long customerId) {
        customerService.updateCustomer(customerDto, customerId);
    }


    @PostMapping(value = "/update-balance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Update customer balance")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public BalanceUpdateDto updateBalance(@RequestParam Long customerId, @RequestParam String encodedFiscal) throws MailjetSocketTimeoutException, MailjetException {
        return customerService.updateBalance(customerId,encodedFiscal);
    }

    @GetMapping(value = "/customer-coupons", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @ApiOperation(value = "Get customer coupons based on customer id")
    @ApiResponses({
            @ApiResponse(code = 404, message = "Could not find the requested customer", response = ErrorDto.class),
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public List<CouponDto> getCustomerCoupons(@RequestParam Long customerId) {
        return couponService.getCustomerCoupons(customerId);
    }

    @GetMapping(value = "/customer-active-coupons", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    @ApiOperation(value = "Get customer coupons based on customer id")
    @ApiResponses({
            @ApiResponse(code = 404, message = "Could not find the requested customer", response = ErrorDto.class),
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public Long getCustomerActiveCoupons(@RequestParam Long customerId) {
        return couponService.countCustomerActiveCoupons(customerId);
    }

}
