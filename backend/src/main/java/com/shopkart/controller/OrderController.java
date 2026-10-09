package com.shopkart.controller;

import com.shopkart.dto.ApiResponse;
import com.shopkart.dto.OrderDto;
import com.shopkart.dto.OrderRequest;
import com.shopkart.entity.User;
import com.shopkart.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getUserOrders(@AuthenticationPrincipal User user) {
        List<OrderDto> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved", orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        OrderDto order = orderService.getOrderById(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved", order));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody OrderRequest request
    ) {
        OrderDto order = orderService.createOrder(user, request);
        return ResponseEntity.ok(ApiResponse.ok("Demo order placed successfully", order));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        OrderDto order = orderService.cancelOrder(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Demo order cancelled", order));
    }

    @PostMapping("/{id}/buy-again")
    public ResponseEntity<ApiResponse<Void>> buyAgain(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        orderService.buyAgain(user, id);
        return ResponseEntity.ok(ApiResponse.ok("Items added back to cart"));
    }
}
