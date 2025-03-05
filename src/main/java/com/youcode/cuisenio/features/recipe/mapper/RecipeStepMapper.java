package com.youcode.cuisenio.features.recipe.mapper;

import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.recipe.dto.ingredient.request.IngredientRequest;
import com.youcode.cuisenio.features.recipe.dto.ingredient.response.IngredientResponse;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.request.RecipeStepRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.response.RecipeStepResponse;
import com.youcode.cuisenio.features.recipe.entity.Ingredient;
import com.youcode.cuisenio.features.recipe.entity.RecipeStep;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RecipeStepMapper extends BaseMapper<RecipeStep, RecipeStepRequest, RecipeStepResponse> {}

