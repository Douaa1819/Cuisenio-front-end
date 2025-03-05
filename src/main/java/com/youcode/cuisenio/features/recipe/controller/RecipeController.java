package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.dto.recipe.request.RecipeRequest;
import com.youcode.cuisenio.features.recipe.dto.recipe.response.RecipeResponse;
import com.youcode.cuisenio.features.recipe.entity.CategoryType;
import com.youcode.cuisenio.features.recipe.entity.DifficultyLevel;
import com.youcode.cuisenio.features.recipe.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RecipeRequest recipeRequest) {

        String email = userDetails.getUsername();

        RecipeResponse response = recipeService.createRecipe(email, recipeRequest);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable Long id) {
        RecipeResponse response = recipeService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<RecipeResponse>> getAllRecipes(
            @PageableDefault(size = 10, sort = "creationDate") Pageable pageable) {
        Page<RecipeResponse> response = recipeService.findAll(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RecipeResponse>> searchRecipes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) DifficultyLevel difficultyLevel,
            @RequestParam(required = false) Integer maxPrepTime,
            @RequestParam(required = false) Integer maxCookTime,
            @RequestParam(required = false) CategoryType categoryType,
            @RequestParam(required = false) Boolean isApproved,
            @PageableDefault(size = 10, sort = "creationDate") Pageable pageable) {

//        Page<RecipeResponse> response = recipeService.searchRecipes(
//                query, difficultyLevel, maxPrepTime, maxCookTime, categoryType, isApproved, pageable);
//        return ResponseEntity.ok(response);
        return null;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByUserId(
            @PathVariable Long userId,
            @PageableDefault(size = 10, sort = "creationDate") Pageable pageable) {
       // Page<RecipeResponse> response = recipeService.getRecipesByUserId(userId, pageable);

       // return ResponseEntity.ok(response);
        return null;
    }

    @GetMapping("/my-recipes")
    public ResponseEntity<Page<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10, sort = "creationDate") Pageable pageable) {
        //Long userId = extractUserId(userDetails);
        //Page<RecipeResponse> response = recipeService.getRecipesByUserId(userId, pageable);
      //  return ResponseEntity.ok(response);
        return null;
    }

//    @PutMapping("/{id}")
//    public ResponseEntity<RecipeDetailResponse>

}