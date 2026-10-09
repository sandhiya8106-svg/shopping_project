package com.shopkart.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private Double price;

    private Double originalPrice;

    private Double rating;

    private Integer reviews;

    private String badge;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String image;

    @Column(columnDefinition = "TEXT")
    private String fallbackImage;

    private String accent;

    private Integer stock;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_specs", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "spec")
    private List<String> specs = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String searchTerms;

    public Product() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviews() { return reviews; }
    public void setReviews(Integer reviews) { this.reviews = reviews; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getFallbackImage() { return fallbackImage; }
    public void setFallbackImage(String fallbackImage) { this.fallbackImage = fallbackImage; }

    public String getAccent() { return accent; }
    public void setAccent(String accent) { this.accent = accent; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public List<String> getSpecs() { return specs; }
    public void setSpecs(List<String> specs) { this.specs = specs; }

    public String getSearchTerms() { return searchTerms; }
    public void setSearchTerms(String searchTerms) { this.searchTerms = searchTerms; }
}
