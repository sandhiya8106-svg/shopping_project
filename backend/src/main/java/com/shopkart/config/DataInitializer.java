package com.shopkart.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopkart.entity.Category;
import com.shopkart.entity.Product;
import com.shopkart.entity.User;
import com.shopkart.repository.CategoryRepository;
import com.shopkart.repository.ProductRepository;
import com.shopkart.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder,
                           ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedDefaultUser();
        seedCatalog();
    }

    private void seedDefaultUser() {
        if (!userRepository.existsByEmail("demo@shopkart.test")) {
            User demoUser = new User();
            demoUser.setEmail("demo@shopkart.test");
            demoUser.setPassword(passwordEncoder.encode("shopkart"));
            demoUser.setFullName("Demo Shopper");
            demoUser.setRole("ROLE_USER");
            userRepository.save(demoUser);
            log.info("Initialized default demo user: demo@shopkart.test / shopkart");
        }
    }

    private void seedCatalog() {
        if (productRepository.count() > 0 && categoryRepository.count() > 0) {
            log.info("Catalog already initialized with {} products.", productRepository.count());
            return;
        }

        try {
            ClassPathResource resource = new ClassPathResource("data/seed_catalog.json");
            if (!resource.exists()) {
                log.warn("seed_catalog.json resource not found!");
                return;
            }

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = objectMapper.readTree(is);

                // Seed categories
                JsonNode categoriesNode = root.get("categories");
                if (categoriesNode != null && categoriesNode.isArray()) {
                    for (JsonNode catNode : categoriesNode) {
                        String name = catNode.get("name").asText();
                        if (categoryRepository.findByName(name).isEmpty()) {
                            Category category = new Category();
                            category.setName(name);
                            category.setSlug(catNode.has("slug") ? catNode.get("slug").asText() : name.toLowerCase().replaceAll("[^a-z0-9]+", "-"));
                            category.setIcon(catNode.has("icon") ? catNode.get("icon").asText() : "ShoppingBag");
                            category.setColor(catNode.has("color") ? catNode.get("color").asText() : "#dbe8ff");
                            category.setDetail(catNode.has("detail") ? catNode.get("detail").asText() : "");
                            categoryRepository.save(category);
                        }
                    }
                    log.info("Initialized categories.");
                }

                // Seed products
                JsonNode productsNode = root.get("products");
                if (productsNode != null && productsNode.isArray()) {
                    List<Product> productsToSave = new ArrayList<>();
                    for (JsonNode prodNode : productsNode) {
                        Long id = prodNode.get("id").asLong();
                        if (!productRepository.existsById(id)) {
                            Product p = new Product();
                            p.setId(id);
                            p.setTitle(prodNode.get("title").asText());
                            p.setCategory(prodNode.get("category").asText());
                            p.setBrand(prodNode.get("brand").asText());
                            p.setPrice(prodNode.get("price").asDouble());
                            p.setOriginalPrice(prodNode.has("originalPrice") ? prodNode.get("originalPrice").asDouble() : p.getPrice() * 1.2);
                            p.setRating(prodNode.has("rating") ? prodNode.get("rating").asDouble() : 4.5);
                            p.setReviews(prodNode.has("reviews") ? prodNode.get("reviews").asInt() : 100);
                            p.setBadge(prodNode.hasNonNull("badge") ? prodNode.get("badge").asText() : null);
                            p.setDescription(prodNode.has("description") ? prodNode.get("description").asText() : "");
                            p.setImage(prodNode.has("image") ? prodNode.get("image").asText() : "");
                            p.setFallbackImage(prodNode.has("fallbackImage") ? prodNode.get("fallbackImage").asText() : p.getImage());
                            p.setAccent(prodNode.has("accent") ? prodNode.get("accent").asText() : "#f5dd9e");
                            p.setStock(prodNode.has("stock") ? prodNode.get("stock").asInt() : 20);
                            p.setSearchTerms(prodNode.has("searchTerms") ? prodNode.get("searchTerms").asText() : "");

                            List<String> specs = new ArrayList<>();
                            if (prodNode.has("specs") && prodNode.get("specs").isArray()) {
                                for (JsonNode specNode : prodNode.get("specs")) {
                                    specs.add(specNode.asText());
                                }
                            }
                            p.setSpecs(specs);

                            productsToSave.add(p);
                        }
                    }
                    productRepository.saveAll(productsToSave);
                    log.info("Initialized {} products from seed catalog.", productsToSave.size());
                }
            }
        } catch (Exception e) {
            log.error("Failed to seed catalog: {}", e.getMessage(), e);
        }
    }
}
