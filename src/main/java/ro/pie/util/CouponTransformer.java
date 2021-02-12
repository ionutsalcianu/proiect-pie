package ro.pie.util;

import ro.pie.dto.CouponDto;
import ro.pie.model.Coupon;

import java.util.List;
import java.util.stream.Collectors;

public class CouponTransformer {
    public List<CouponDto> toDtoList(List<Coupon> coupons){
        if(coupons.isEmpty()){
            return null;
        }
        return coupons.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CouponDto toDto(Coupon input){
        return CouponDto.builder()
                .code(input.getCode())
                .creationDate(input.getCreationDate())
                .expirationDate(input.getExpirationDate())
                .used(input.getUsed())
                .value(input.getValue())
                .usedDate(input.getUsedDate())
                .customerId(input.getCustomerId())
                .id(input.getId())
                .shopName(input.getShop() != null ? input.getShop().getName() : null)
                .build();
    }
}
