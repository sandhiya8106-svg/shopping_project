package com.shopkart.dto;

import com.shopkart.entity.Order;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private String fullName;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String zip;
    private String paymentMethod;
    private Double subtotal;
    private Double deliveryFee;
    private Double discount;
    private Double total;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDto> items = new ArrayList<>();

    public OrderDto() {}

    public OrderDto(Order order) {
        this.id = order.getId();
        this.orderNumber = order.getOrderNumber();
        this.fullName = order.getFullName();
        this.phone = order.getPhone();
        this.street = order.getStreet();
        this.city = order.getCity();
        this.state = order.getState();
        this.zip = order.getZip();
        this.paymentMethod = order.getPaymentMethod();
        this.subtotal = order.getSubtotal();
        this.deliveryFee = order.getDeliveryFee();
        this.discount = order.getDiscount();
        this.total = order.getTotal();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();
        if (order.getItems() != null) {
            this.items = order.getItems().stream().map(OrderItemDto::new).collect(Collectors.toList());
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(Double deliveryFee) { this.deliveryFee = deliveryFee; }

    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
}
