package com.shopkart.controller;

import com.shopkart.dto.AddressRequest;
import com.shopkart.dto.ApiResponse;
import com.shopkart.dto.UserDto;
import com.shopkart.entity.Address;
import com.shopkart.entity.User;
import com.shopkart.repository.AddressRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AddressRepository addressRepository;

    public UserController(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved", new UserDto(user)));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(@AuthenticationPrincipal User user) {
        List<Address> addresses = addressRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(ApiResponse.ok("Addresses retrieved", addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<Address>> saveAddress(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddressRequest request
    ) {
        Address address = new Address();
        address.setUser(user);
        address.setFullName(request.getFullName().trim());
        address.setPhone(request.getPhone().trim());
        address.setStreet(request.getStreet().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setZip(request.getZip().trim());
        address.setIsDefault(request.getIsDefault());

        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.ok("Address saved successfully", saved));
    }
}
