package ro.pie.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    @Setter(AccessLevel.NONE)
    @JsonIgnore
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @JsonIgnore
    private String key;
    @JsonIgnore
    private Long balance;

}
