package com.shopkart.service;

import com.shopkart.dto.OrderDto;
import com.shopkart.dto.OrderRequest;
import com.shopkart.entity.*;
import com.shopkart.exception.ForbiddenAccessException;
import com.shopkart.exception.ResourceNotFoundException;
import com.shopkart.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository,
                        AddressRepository addressRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
    }

    public List<OrderDto> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(OrderDto::new)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized to view this order");
        }

        return new OrderDto(order);
    }

    @Transactional
    public OrderDto createOrder(User user, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtAsc(user);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot place order with an empty cart");
        }

        double subtotal = 0.0;
        double savings = 0.0;
        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            subtotal += (p.getPrice() != null ? p.getPrice() : 0.0) * item.getQuantity();
            if (p.getOriginalPrice() != null && p.getOriginalPrice() > p.getPrice()) {
                savings += (p.getOriginalPrice() - p.getPrice()) * item.getQuantity();
            }
        }

        double deliveryFee = (subtotal >= 60.0) ? 0.0 : 8.0;
        double total = Math.round((subtotal + deliveryFee) * 100.0) / 100.0;

        String orderNumber = "SK-" + (100000 + new Random().nextInt(900000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setFullName(request.getFullName().trim());
        order.setPhone(request.getPhone().trim());
        order.setStreet(request.getStreet().trim());
        order.setCity(request.getCity().trim());
        order.setState(request.getState().trim());
        order.setZip(request.getZip().trim());
        order.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "cod");
        order.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        order.setDeliveryFee(deliveryFee);
        order.setDiscount(Math.round(savings * 100.0) / 100.0);
        order.setTotal(total);
        order.setStatus("Ordered");
        order.setCreatedAt(LocalDateTime.now());

        for (CartItem ci : cartItems) {
            OrderItem oi = new OrderItem(
                    order,
                    ci.getProduct(),
                    ci.getProduct().getTitle(),
                    ci.getProduct().getImage(),
                    ci.getProduct().getPrice(),
                    ci.getQuantity()
            );
            order.getItems().add(oi);
        }

        Order savedOrder = orderRepository.save(order);

        // Save delivery address to user's saved addresses
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName().trim());
        address.setPhone(request.getPhone().trim());
        address.setStreet(request.getStreet().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setZip(request.getZip().trim());
        address.setIsDefault(true);
        addressRepository.save(address);

        // Clear cart
        cartItemRepository.deleteByUser(user);

        return new OrderDto(savedOrder);
    }

    @Transactional
    public OrderDto cancelOrder(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized to cancel this order");
        }

        order.setStatus("Cancelled");
        Order updated = orderRepository.save(order);
        return new OrderDto(updated);
    }

    @Transactional
    public void buyAgain(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized to reorder from this order");
        }

        for (OrderItem oi : order.getItems()) {
            if (oi.getProduct() != null) {
                cartItemRepository.findByUserAndProduct(user, oi.getProduct())
                        .ifPresentOrElse(
                                existing -> {
                                    existing.setQuantity(existing.getQuantity() + oi.getQuantity());
                                    cartItemRepository.save(existing);
                                },
                                () -> {
                                    CartItem newItem = new CartItem(user, oi.getProduct(), oi.getQuantity());
                                    cartItemRepository.save(newItem);
                                }
                        );
            }
        }
    }
}
