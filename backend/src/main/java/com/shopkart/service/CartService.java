package com.shopkart.service;

import com.shopkart.dto.CartItemDto;
import com.shopkart.dto.CartResponse;
import com.shopkart.entity.CartItem;
import com.shopkart.entity.Product;
import com.shopkart.entity.SavedItem;
import com.shopkart.entity.User;
import com.shopkart.exception.ForbiddenAccessException;
import com.shopkart.exception.ResourceNotFoundException;
import com.shopkart.repository.CartItemRepository;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.SavedItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final SavedItemRepository savedItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository,
                       SavedItemRepository savedItemRepository,
                       ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.savedItemRepository = savedItemRepository;
        this.productRepository = productRepository;
    }

    public CartResponse getCart(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUserOrderByCreatedAtAsc(user);
        List<SavedItem> savedItems = savedItemRepository.findByUserOrderByCreatedAtDesc(user);

        CartResponse response = new CartResponse();
        response.setItems(cartItems.stream().map(CartItemDto::new).collect(Collectors.toList()));
        response.setSavedItems(savedItems.stream().map(CartItemDto::new).collect(Collectors.toList()));

        double subtotal = 0.0;
        double savings = 0.0;
        int count = 0;

        for (CartItem item : cartItems) {
            Product p = item.getProduct();
            int qty = item.getQuantity();
            subtotal += (p.getPrice() != null ? p.getPrice() : 0.0) * qty;
            if (p.getOriginalPrice() != null && p.getOriginalPrice() > p.getPrice()) {
                savings += (p.getOriginalPrice() - p.getPrice()) * qty;
            }
            count += qty;
        }

        double deliveryFee = (subtotal >= 60.0 || cartItems.isEmpty()) ? 0.0 : 8.0;
        double total = subtotal + deliveryFee;

        response.setSubtotal(Math.round(subtotal * 100.0) / 100.0);
        response.setDeliveryCharges(deliveryFee);
        response.setDemoSavings(Math.round(savings * 100.0) / 100.0);
        response.setTotal(Math.round(total * 100.0) / 100.0);
        response.setCount(count);

        return response;
    }

    @Transactional
    public CartResponse addToCart(User user, Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        int qtyToAdd = (quantity != null && quantity > 0) ? quantity : 1;

        Optional<CartItem> existingCartItem = cartItemRepository.findByUserAndProduct(user, product);
        if (existingCartItem.isPresent()) {
            CartItem item = existingCartItem.get();
            item.setQuantity(item.getQuantity() + qtyToAdd);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(user, product, qtyToAdd);
            cartItemRepository.save(newItem);
        }

        // If it was in saved items, remove it
        savedItemRepository.deleteByUserAndProduct(user, product);

        return getCart(user);
    }

    @Transactional
    public CartResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized cart item modification");
        }

        if (quantity == null || quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return getCart(user);
    }

    @Transactional
    public CartResponse removeFromCart(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized cart item modification");
        }

        cartItemRepository.delete(item);
        return getCart(user);
    }

    @Transactional
    public CartResponse clearCart(User user) {
        cartItemRepository.deleteByUser(user);
        return getCart(user);
    }

    @Transactional
    public CartResponse saveForLater(User user, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized cart item modification");
        }

        Product product = item.getProduct();
        cartItemRepository.delete(item);

        if (savedItemRepository.findByUserAndProduct(user, product).isEmpty()) {
            SavedItem saved = new SavedItem(user, product);
            savedItemRepository.save(saved);
        }

        return getCart(user);
    }

    @Transactional
    public CartResponse moveToCart(User user, Long savedItemId) {
        SavedItem item = savedItemRepository.findById(savedItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new ForbiddenAccessException("Unauthorized saved item modification");
        }

        Product product = item.getProduct();
        savedItemRepository.delete(item);

        Optional<CartItem> cartItemOpt = cartItemRepository.findByUserAndProduct(user, product);
        if (cartItemOpt.isPresent()) {
            CartItem cartItem = cartItemOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + 1);
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem(user, product, 1);
            cartItemRepository.save(cartItem);
        }

        return getCart(user);
    }
}
