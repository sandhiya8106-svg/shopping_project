package com.shopkart.controller;

import com.shopkart.dto.AddToCartRequest;
import com.shopkart.dto.ApiResponse;
import com.shopkart.dto.CartResponse;
import com.shopkart.dto.UpdateCartRequest;
import com.shopkart.entity.User;
import com.shopkart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@AuthenticationPrincipal User user) {
        CartResponse cart = cartService.getCart(user);
        return ResponseEntity.ok(ApiResponse.ok("Cart retrieved", cart));
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartResponse cart = cartService.addToCart(user, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartRequest request
    ) {
        CartResponse cart = cartService.updateQuantity(user, id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok("Cart updated", cart));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        CartResponse cart = cartService.removeFromCart(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(@AuthenticationPrincipal User user) {
        CartResponse cart = cartService.clearCart(user);
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", cart));
    }

    @PostMapping("/save-for-later/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> saveForLater(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        CartResponse cart = cartService.saveForLater(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Item saved for later", cart));
    }

    @PostMapping("/move-to-cart/{id}")
    public ResponseEntity<ApiResponse<CartResponse>> moveToCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        CartResponse cart = cartService.moveToCart(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Item moved to cart", cart));
    }
}
