package com.youcode.cuisenio.features.recipe.repository;

import com.youcode.cuisenio.features.recipe.entity.RecipeRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRatingRepository extends JpaRepository<RecipeRating, Long> {
    List<RecipeRating> findByRecipeId(Long recipeId);

    Optional<RecipeRating> findByRecipeIdAndUserId(Long recipeId, Long userId);

    @Query("SELECT AVG(rr.score) FROM RecipeRating rr WHERE rr.recipe.id = :recipeId")
    Double getAverageRatingByRecipeId(@Param("recipeId") Long recipeId);

    @Query("SELECT COUNT(rr) FROM RecipeRating rr WHERE rr.recipe.id = :recipeId")
    Integer countByRecipeId(@Param("recipeId") Long recipeId);

    @Modifying
    @Query("DELETE FROM RecipeRating rr WHERE rr.recipe.id = :recipeId")
    void deleteByRecipeId(@Param("recipeId") Long recipeId);
}