package com.shopkart.service;

import com.shopkart.config.JwtUtils;
import com.shopkart.dto.AuthRequest;
import com.shopkart.dto.AuthResponse;
import com.shopkart.dto.RegisterRequest;
import com.shopkart.dto.UserDto;
import com.shopkart.entity.User;
import com.shopkart.exception.DuplicateResourceException;
import com.shopkart.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("An account with this email address already exists.");
        }

        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getName().trim());
        user.setRole("ROLE_USER");
        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateToken(savedUser.getEmail());
        return new AuthResponse(token, new UserDto(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email address or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email address or password.");
        }

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, new UserDto(user));
    }

    public UserDto getMe(User user) {
        return new UserDto(user);
    }
}
