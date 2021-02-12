package ro.pie.util;

import ro.pie.dto.UserDto;
import ro.pie.model.Customer;

public class CustomerTransformer {

    public UserDto toDto(Customer input){
        return UserDto.builder()
                .id(input.getId())
                .lastName(input.getLastName())
                .firstName(input.getFirstName())
                .email(input.getEmail())
                .userType(UserType.valueOf(input.getRole()))
                .build();
    }
}
