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
import ro.pie.util.CampaignType;

import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost")
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
    public String generateFiscal(@RequestParam Double value, @RequestParam Long adminId) {
        return adminService.encodeFiscal(value, adminId);
    }

    @PostMapping(value = "/useCoupon")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Use coupon")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void useCoupon(@RequestParam String email, @RequestParam String couponCode, @RequestParam Long adminId) {
        couponService.useCoupon(email, couponCode, adminId);
    }

    @PostMapping(value = "/startCampaign")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Start campaign")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public void startCampaign(@RequestParam String campaignType) {
        couponService.generateCampaign(CampaignType.getInstance(campaignType));
    }

    @GetMapping(value = "/getCampaigns")
    @ResponseStatus(HttpStatus.OK)
    @ApiOperation(value = "Get campaigns")
    @ApiResponses({
            @ApiResponse(code = 400, message = "Bad request, one of the arguments may be invalid", response = ErrorDto.class),
            @ApiResponse(code = 500, message = "Internal server error", response = ErrorDto.class),
            @ApiResponse(code = 200, message = "Success")
    })
    public List<String> getCampaigns() {
        return couponService.getCampaigns();
    }
}
