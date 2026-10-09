package com.shopkart.repository;

import com.shopkart.entity.Product;
import com.shopkart.entity.SavedItem;
import com.shopkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    List<SavedItem> findByUserOrderByCreatedAtDesc(User user);
    Optional<SavedItem> findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
}
