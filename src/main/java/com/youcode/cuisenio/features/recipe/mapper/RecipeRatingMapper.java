package com.youcode.cuisenio.features.recipe.mapper;

import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.request.RecipeRatingRequest;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.response.RecipeRatingResponse;
import com.youcode.cuisenio.features.recipe.entity.RecipeRating;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RecipeRatingMapper extends BaseMapper<RecipeRating, RecipeRatingRequest, RecipeRatingResponse> {}

