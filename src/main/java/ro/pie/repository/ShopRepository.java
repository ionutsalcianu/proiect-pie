package ro.pie.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ro.pie.model.Shop;

public interface ShopRepository extends JpaRepository<Shop, Long> {
}
