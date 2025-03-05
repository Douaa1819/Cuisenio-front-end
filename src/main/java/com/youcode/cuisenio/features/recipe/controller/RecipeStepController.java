package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.dto.recipeStep.request.RecipeStepRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.response.RecipeStepResponse;
import com.youcode.cuisenio.features.recipe.service.RecipeStepService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/recipes/{recipeId}/steps")
public class RecipeStepController {
    private final RecipeStepService recipeStepService;

    public RecipeStepController(RecipeStepService recipeStepService) {
        this.recipeStepService = recipeStepService;
    }

    @PostMapping
    public ResponseEntity<List<RecipeStepResponse>> createSteps(
            @PathVariable Long recipeId,
            @Valid @RequestBody List<RecipeStepRequest> request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeStepService.create(recipeId, request));
    }

    @GetMapping
    public ResponseEntity<List<RecipeStepResponse>> getSteps(@PathVariable Long recipeId) {
        return ResponseEntity.ok(recipeStepService.getStepsByRecipeId(recipeId));
    }
}