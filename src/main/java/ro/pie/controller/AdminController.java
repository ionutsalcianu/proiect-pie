package ro.pie.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ro.pie.dto.ErrorDto;
import ro.pie.service.AdminService;
import ro.pie.service.CouponService;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin-controller")
@Api(value = "admin-controller")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private CouponService couponService;

    @PostMapping(value = "/generateFiscal")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Generate encoded fiscal")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public String generateFiscal(@RequestParam Double value, @RequestParam Long shopId) {
        return adminService.encodeFiscal(value, shopId);
    }

    @PostMapping(value = "/useCoupon")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Use coupon")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void useCoupon(@RequestParam Long customerId, @RequestParam String couponCode) {
        couponService.useCoupon(customerId, couponCode);
    }
}