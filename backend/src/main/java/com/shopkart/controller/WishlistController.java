package com.shopkart.controller;

import com.shopkart.dto.ApiResponse;
import com.shopkart.entity.Product;
import com.shopkart.entity.User;
import com.shopkart.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getWishlist(@AuthenticationPrincipal User user) {
        List<Product> items = wishlistService.getWishlist(user);
        return ResponseEntity.ok(ApiResponse.ok("Wishlist retrieved", items));
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResponse<List<Long>>> getWishlistIds(@AuthenticationPrincipal User user) {
        List<Long> ids = wishlistService.getWishlistProductIds(user);
        return ResponseEntity.ok(ApiResponse.ok("Wishlist IDs retrieved", ids));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId
    ) {
        boolean isWishlisted = wishlistService.toggleWishlist(user, productId);
        String message = isWishlisted ? "Saved to wishlist" : "Removed from wishlist";
        return ResponseEntity.ok(ApiResponse.ok(message, Map.of("productId", productId, "isWishlisted", isWishlisted)));
    }
}
