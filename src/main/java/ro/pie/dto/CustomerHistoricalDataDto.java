package ro.pie.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CustomerHistoricalDataDto {

    private LocalDateTime timestamp;
    private Long points;
    private Long activeCoupons;
    private Long totalCoupons;
}
