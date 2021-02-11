package ro.pie.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "CUSTOMER")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID")
    private Long id;

    @Column(name = "C_LASTNAME")
    private String lastName;

    @Column(name = "C_FIRSTNAME")
    private String firstName;

    @Column(name = "C_EMAIL")
    private String email;

    @Column(name = "C_KEY")
    private String key;

    @Column(name = "C_BALANCE")
    private Long balance;

    @Column(name = "C_PASSWORD")
    private String password;

    @Column(name = "C_ROLE")
    private String role;

    @OneToMany(mappedBy="customer",fetch = FetchType.LAZY)
    private Set<Coupon> coupons;
}
