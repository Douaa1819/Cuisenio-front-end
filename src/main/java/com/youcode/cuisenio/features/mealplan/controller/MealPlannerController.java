package com.youcode.cuisenio.features.mealplan.controller;

import com.youcode.cuisenio.features.mealplan.dto.request.MealPlannerRequest;
import com.youcode.cuisenio.features.mealplan.dto.response.MealPlannerResponse;
import com.youcode.cuisenio.features.mealplan.service.MealPlannerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/meal-plans")
public class MealPlannerController {

    private final MealPlannerService mealPlannerService;

    public MealPlannerController(MealPlannerService mealPlannerService) {
        this.mealPlannerService = mealPlannerService;
    }

    @PostMapping("/{recipeId}")
    public ResponseEntity<MealPlannerResponse> createMealPlan(
            @PathVariable Long recipeId, // Récupérer recipeId depuis l'URL
            @Valid @RequestBody MealPlannerRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        MealPlannerResponse response = mealPlannerService.createMealPlan(recipeId, request, email);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MealPlannerResponse>> getMealPlansByUser(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        List<MealPlannerResponse> response = mealPlannerService.getMealPlansByUser(email);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlannerResponse> updateMealPlan(
            @PathVariable Long id,
            @Valid @RequestBody MealPlannerRequest request) {

        MealPlannerResponse response = mealPlannerService.updateMealPlan(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id) {
        mealPlannerService.deleteMealPlan(id);
        return ResponseEntity.noContent().build();
    }
}