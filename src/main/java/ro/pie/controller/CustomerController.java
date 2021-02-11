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
import ro.pie.dto.CustomerDto;
import ro.pie.dto.ErrorDto;
import ro.pie.service.CustomerService;

@Slf4j
@RestController
@RequestMapping("/api/v1/customer-controller")
@Api(value = "customer-controller")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

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

    @PostMapping(value = "/update-balance", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Update customer balance")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void updateBalance(@RequestParam Long customerId, @RequestParam String encodedFiscal) throws MailjetSocketTimeoutException, MailjetException {
        customerService.updateBalance(customerId,encodedFiscal);
    }

}
