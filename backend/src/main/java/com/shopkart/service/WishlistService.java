package com.shopkart.service;

import com.shopkart.entity.Product;
import com.shopkart.entity.User;
import com.shopkart.entity.WishlistItem;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistItemRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    public List<Product> getWishlist(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(WishlistItem::getProduct)
                .collect(Collectors.toList());
    }

    public List<Long> getWishlistProductIds(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(item -> item.getProduct().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean toggleWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        Optional<WishlistItem> existing = wishlistRepository.findByUserAndProduct(user, product);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return false;
        } else {
            WishlistItem item = new WishlistItem(user, product);
            wishlistRepository.save(item);
            return true;
        }
    }
}
