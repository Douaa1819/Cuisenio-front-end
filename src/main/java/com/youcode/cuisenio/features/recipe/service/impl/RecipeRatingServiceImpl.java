package com.youcode.cuisenio.features.recipe.service.impl;


import com.youcode.cuisenio.features.auth.entity.User;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.request.RecipeRatingRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.response.RecipeRatingResponse;
import com.youcode.cuisenio.features.recipe.entity.Recipe;
import com.youcode.cuisenio.features.recipe.entity.RecipeRating;
import com.youcode.cuisenio.features.recipe.exception.RecipeNotFoundException;
import com.youcode.cuisenio.features.recipe.mapper.RecipeRatingMapper;
import com.youcode.cuisenio.features.recipe.repository.RecipeRatingRepository;
import com.youcode.cuisenio.features.recipe.repository.RecipeRepository;
import com.youcode.cuisenio.features.auth.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeRatingServiceImpl {

    private final RecipeRatingRepository recipeRatingRepository;
    private final RecipeRepository recipeRepository;
    private final UserService userService;
    private final RecipeRatingMapper recipeRatingMapper;

    public RecipeRatingServiceImpl(RecipeRatingRepository recipeRatingRepository,
                                   RecipeRepository recipeRepository,
                                   UserService userService,
                                   RecipeRatingMapper recipeRatingMapper) {
        this.recipeRatingRepository = recipeRatingRepository;
        this.recipeRepository = recipeRepository;
        this.userService = userService;
        this.recipeRatingMapper = recipeRatingMapper;
    }

    public RecipeRatingResponse createRating(Long recipeId, RecipeRatingRequest request, String email) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + recipeId));

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RecipeRating rating = recipeRatingMapper.toEntity(request);
        rating.setRecipe(recipe);
        rating.setUser(user);
        rating.setCreatedAt(new Date());

        rating = recipeRatingRepository.save(rating);

        return recipeRatingMapper.toResponse(rating);
    }

    public List<RecipeRatingResponse> getRatingsByRecipeId(Long recipeId) {
        List<RecipeRating> ratings = recipeRatingRepository.findByRecipeId(recipeId);

        return ratings.stream()
                .map(recipeRatingMapper::toResponse)
                .collect(Collectors.toList());
    }
}