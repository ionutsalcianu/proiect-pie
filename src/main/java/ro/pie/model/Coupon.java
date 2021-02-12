package ro.pie.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CP_ID")
    private Long id;

    @Column(name = "CP_C_ID")
    private Long customerId;

    @Column(name = "CP_S_ID")
    private Long shopId;

    @Column(name = "CP_VALUE")
    private Long value;

    @Column(name = "CP_USED")
    private Boolean used;

    @Column(name = "CP_CODE")
    private String code;

    @Column(name = "CP_CREATION_DATE")
    private Date creationDate;

    @Column(name = "CP_EXPIRATION_DATE")
    private Date expirationDate;

    @Column(name = "CP_USED_DATE")
    private Date usedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="CP_C_ID",insertable = false,updatable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="CP_S_ID",insertable = false,updatable = false)
    private Shop shop;

}
