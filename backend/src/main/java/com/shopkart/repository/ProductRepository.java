package com.shopkart.repository;

import com.shopkart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    @Query("SELECT p FROM Product p WHERE p.badge IS NOT NULL")
    List<Product> findFeaturedProducts();

    @Query("SELECT p FROM Product p WHERE p.originalPrice > p.price ORDER BY ((p.originalPrice - p.price) / p.originalPrice) DESC")
    List<Product> findTopDeals(Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.rating DESC, p.reviews DESC")
    List<Product> findBestSellers(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE (:category IS NULL OR LOWER(p.category) = LOWER(:category))
          AND (:minPrice IS NULL OR p.price >= :minPrice)
          AND (:maxPrice IS NULL OR p.price <= :maxPrice)
          AND (:minRating IS NULL OR p.rating >= :minRating)
          AND (:query IS NULL OR (
                LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')) OR
                LOWER(p.searchTerms) LIKE LOWER(CONCAT('%', :query, '%'))
          ))
    """)
    Page<Product> searchAndFilter(
        @Param("category") String category,
        @Param("minPrice") Double minPrice,
        @Param("maxPrice") Double maxPrice,
        @Param("minRating") Double minRating,
        @Param("query") String query,
        Pageable pageable
    );
}
