package com.shopkart.service;

import com.shopkart.entity.Product;
import com.shopkart.exception.ResourceNotFoundException;
import com.shopkart.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getProducts(
            String category,
            Double minPrice,
            Double maxPrice,
            Double minRating,
            String query,
            String sort,
            int page,
            int size
    ) {
        Sort sortObj = Sort.by("id").ascending();
        if ("price-low".equalsIgnoreCase(sort)) {
            sortObj = Sort.by("price").ascending();
        } else if ("price-high".equalsIgnoreCase(sort)) {
            sortObj = Sort.by("price").descending();
        } else if ("rating".equalsIgnoreCase(sort)) {
            sortObj = Sort.by("rating").descending().and(Sort.by("reviews").descending());
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        // If category is "All" or empty, treat as null
        if (category != null && (category.isBlank() || category.equalsIgnoreCase("All"))) {
            category = null;
        }

        if (query != null && query.isBlank()) {
            query = null;
        }

        Page<Product> productPage = productRepository.searchAndFilter(
                category,
                minPrice,
                maxPrice,
                minRating,
                query,
                pageable
        );

        // If sorting by deals, sort the content by discount ratio
        if ("deals".equalsIgnoreCase(sort)) {
            List<Product> content = productPage.getContent().stream()
                    .sorted((a, b) -> {
                        double discA = a.getOriginalPrice() != null && a.getOriginalPrice() > 0 ? (a.getOriginalPrice() - a.getPrice()) / a.getOriginalPrice() : 0.0;
                        double discB = b.getOriginalPrice() != null && b.getOriginalPrice() > 0 ? (b.getOriginalPrice() - b.getPrice()) / b.getOriginalPrice() : 0.0;
                        return Double.compare(discB, discA);
                    })
                    .toList();
            return new PageImpl<>(content, pageable, productPage.getTotalElements());
        }

        return productPage;
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getTopDeals(int limit) {
        return productRepository.findTopDeals(PageRequest.of(0, limit));
    }

    public List<Product> getBestSellers(int limit) {
        return productRepository.findBestSellers(PageRequest.of(0, limit));
    }

    public List<Product> getRelatedProducts(Long excludeId, String category, int limit) {
        List<Product> categoryProducts = productRepository.findByCategoryIgnoreCase(category);
        return categoryProducts.stream()
                .filter(p -> !p.getId().equals(excludeId))
                .limit(limit)
                .toList();
    }
}
