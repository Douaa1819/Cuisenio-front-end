package com.youcode.cuisenio.features.recipe.repository;

import com.youcode.cuisenio.features.recipe.entity.RecipeComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeCommentRepository extends JpaRepository<RecipeComment, Long> {

    List<RecipeComment> findByRecipeId(Long recipeId);
    @Modifying
    @Query("DELETE FROM RecipeComment rc WHERE rc.recipe.id = :recipeId")
    void deleteByRecipeId(@Param("recipeId") Long recipeId);
}