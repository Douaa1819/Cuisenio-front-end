package com.youcode.cuisenio.features.recipe.controller;

import com.youcode.cuisenio.features.recipe.dto.comment.request.RecipeCommentRequest;
import com.youcode.cuisenio.features.recipe.dto.comment.response.RecipeCommentResponse;
import com.youcode.cuisenio.features.recipe.service.impl.RecipeCommentServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes/{recipeId}/comments")
public class RecipeCommentController {

    private final RecipeCommentServiceImpl recipeCommentService;

    public RecipeCommentController(RecipeCommentServiceImpl recipeCommentService) {
        this.recipeCommentService = recipeCommentService;
    }

    @PostMapping
    public ResponseEntity<RecipeCommentResponse> createComment(
            @PathVariable Long recipeId,
            @Valid @RequestBody RecipeCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        RecipeCommentResponse response = recipeCommentService.create(recipeId, request, email);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecipeCommentResponse>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        List<RecipeCommentResponse> comments = recipeCommentService.getCommentsByRecipeId(recipeId);
        return ResponseEntity.ok(comments);
    }

    @PatchMapping("/{commentId}/approve")
    public ResponseEntity<RecipeCommentResponse> approveComment(
            @PathVariable Long recipeId,
            @PathVariable Long commentId,
            @RequestParam boolean isApproved) {

        RecipeCommentResponse response = recipeCommentService.approveComment(commentId, isApproved);
        return ResponseEntity.ok(response);
    }
}