package ro.pie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponDto {
    private Long id;
    private Long customerId;
    private Long value;
    private String shopName;
    private Boolean used;
    private String code;
    private Date creationDate;
    private Date expirationDate;
    private Date usedDate;
}
