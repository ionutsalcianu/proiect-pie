package ro.pie.controller;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.pie.dto.CustomerDto;
import ro.pie.dto.UserDto;
import ro.pie.exception.WrongPasswordException;
import ro.pie.service.CustomerService;

@RestController
@RequestMapping("/api/v1/auth-controller")
@Slf4j
@Api(value = "auth-controller")
@CrossOrigin(origins = "http://localhost")
final class LoginController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public UserDto login(@RequestParam("email") final String email, @RequestParam("password") final String password) {
        UserDetails userDetails = customerService.loadUserByUsername(email);
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new WrongPasswordException("Wrong password");
        }
        return customerService.getCustomerByEmail(email);
    }

//    @PostMapping("/login")
//    String login(
//            @RequestParam("username") final String username,
//            @RequestParam("password") final String password) {
//        return authentication
//                .login(username, password)
//                .orElseThrow(() -> new RuntimeException("invalid login and/or password"));
//    }
}
