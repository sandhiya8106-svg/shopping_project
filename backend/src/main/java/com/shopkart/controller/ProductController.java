package com.shopkart.controller;

import com.shopkart.dto.ApiResponse;
import com.shopkart.entity.Product;
import com.shopkart.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "featured") String sort,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "24") int size
    ) {
        Page<Product> products = productService.getProducts(category, minPrice, maxPrice, minRating, q, sort, page, size);
        return ResponseEntity.ok(ApiResponse.ok("Products retrieved", products));
    }

    @GetMapping("/deals")
    public ResponseEntity<ApiResponse<List<Product>>> getTopDeals(
            @RequestParam(required = false, defaultValue = "8") int limit
    ) {
        List<Product> deals = productService.getTopDeals(limit);
        return ResponseEntity.ok(ApiResponse.ok("Deals retrieved", deals));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<ApiResponse<List<Product>>> getBestSellers(
            @RequestParam(required = false, defaultValue = "6") int limit
    ) {
        List<Product> bestSellers = productService.getBestSellers(limit);
        return ResponseEntity.ok(ApiResponse.ok("Bestsellers retrieved", bestSellers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok("Product retrieved", product));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<ApiResponse<List<Product>>> getRelatedProducts(
            @PathVariable Long id,
            @RequestParam String category,
            @RequestParam(required = false, defaultValue = "4") int limit
    ) {
        List<Product> related = productService.getRelatedProducts(id, category, limit);
        return ResponseEntity.ok(ApiResponse.ok("Related products retrieved", related));
    }
}
