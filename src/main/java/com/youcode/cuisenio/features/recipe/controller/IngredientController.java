package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.dto.ingredient.request.IngredientRequest;
import com.youcode.cuisenio.features.recipe.dto.ingredient.response.IngredientResponse;
import com.youcode.cuisenio.features.recipe.service.IngredientService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/ingredients")
public class IngredientController {

    private final IngredientService ingredientService;

    public IngredientController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @GetMapping
    public ResponseEntity<Page<IngredientResponse>> findAll(Pageable pageable) {
        return ResponseEntity.ok(ingredientService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ingredientService.findById(id));
    }

    @PostMapping
    public ResponseEntity<IngredientResponse> create(@Valid @RequestBody IngredientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ingredientService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody IngredientRequest request) {
        return ResponseEntity.ok(ingredientService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ingredientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}