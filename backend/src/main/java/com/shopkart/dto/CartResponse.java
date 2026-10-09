package com.shopkart.dto;

import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private List<CartItemDto> items = new ArrayList<>();
    private List<CartItemDto> savedItems = new ArrayList<>();
    private Double subtotal = 0.0;
    private Double deliveryCharges = 0.0;
    private Double demoSavings = 0.0;
    private Double total = 0.0;
    private Integer count = 0;

    public CartResponse() {}

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public List<CartItemDto> getSavedItems() { return savedItems; }
    public void setSavedItems(List<CartItemDto> savedItems) { this.savedItems = savedItems; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDeliveryCharges() { return deliveryCharges; }
    public void setDeliveryCharges(Double deliveryCharges) { this.deliveryCharges = deliveryCharges; }

    public Double getDemoSavings() { return demoSavings; }
    public void setDemoSavings(Double demoSavings) { this.demoSavings = demoSavings; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }
}
