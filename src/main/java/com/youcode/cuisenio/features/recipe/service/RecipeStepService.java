package com.youcode.cuisenio.features.recipe.service;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.request.RecipeStepRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.response.RecipeStepResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RecipeStepService {
     List<RecipeStepResponse> getStepsByRecipeId(Long recipeId);
    List<RecipeStepResponse> create(Long recipeId, List<RecipeStepRequest> requests);
}
