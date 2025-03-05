package com.youcode.cuisenio.features.recipe.mapper;

import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.recipe.dto.category.response.CategoryResponse;
import com.youcode.cuisenio.features.recipe.dto.comment.response.RecipeCommentResponse;
import com.youcode.cuisenio.features.recipe.dto.recipe.request.RecipeRequest;
import com.youcode.cuisenio.features.recipe.dto.recipe.response.RecipeResponse;
import com.youcode.cuisenio.features.recipe.dto.recipeIngredient.response.RecipeIngredientResponse;
import com.youcode.cuisenio.features.recipe.dto.recipeRating.response.RecipeRatingResponse;
import com.youcode.cuisenio.features.recipe.dto.recipeStep.response.RecipeStepResponse;
import com.youcode.cuisenio.features.recipe.entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RecipeMapper extends BaseMapper<Recipe, RecipeRequest, RecipeResponse> {

    @Override
    @Mapping(target = "categorie", ignore = true)
    @Mapping(target = "creationDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    Recipe toEntity(RecipeRequest request);

    @AfterMapping
    default void mapCategory(RecipeRequest request, @MappingTarget Recipe recipe) {
        if (request.categoryIds() != null && !request.categoryIds().isEmpty()) {
            Category category = new Category();
            category.setId(request.categoryIds().get(0)); // Associer l'ID de la catégorie
            recipe.setCategorie(category);
        } else {
            throw new IllegalArgumentException("Category ID is required");
        }
    }
}