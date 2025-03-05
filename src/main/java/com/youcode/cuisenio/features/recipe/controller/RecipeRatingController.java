
package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.dto.recipeRating.request.RecipeRatingRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.response.RecipeRatingResponse;
import com.youcode.cuisenio.features.recipe.service.impl.RecipeRatingServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/ratings")
public class RecipeRatingController {

    private final RecipeRatingServiceImpl recipeRatingService;

    public RecipeRatingController(RecipeRatingServiceImpl recipeRatingService) {
        this.recipeRatingService = recipeRatingService;
    }

    @PostMapping
    public ResponseEntity<RecipeRatingResponse> createRating(
            @PathVariable Long recipeId,
            @Valid @RequestBody RecipeRatingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        RecipeRatingResponse response = recipeRatingService.createRating(recipeId, request, email);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecipeRatingResponse>> getRatingsByRecipeId(@PathVariable Long recipeId) {
        List<RecipeRatingResponse> ratings = recipeRatingService.getRatingsByRecipeId(recipeId);
        return ResponseEntity.ok(ratings);
    }
}