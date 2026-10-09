package com.shopkart.dto;

import com.shopkart.entity.OrderItem;

public class OrderItemDto {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productImage;
    private Double price;
    private Integer quantity;

    public OrderItemDto() {}

    public OrderItemDto(OrderItem item) {
        this.id = item.getId();
        if (item.getProduct() != null) {
            this.productId = item.getProduct().getId();
        }
        this.productTitle = item.getProductTitle();
        this.productImage = item.getProductImage();
        this.price = item.getPrice();
        this.quantity = item.getQuantity();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
