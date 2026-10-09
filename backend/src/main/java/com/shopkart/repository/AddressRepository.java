package com.shopkart.repository;

import com.shopkart.entity.Address;
import com.shopkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserOrderByCreatedAtDesc(User user);
}
