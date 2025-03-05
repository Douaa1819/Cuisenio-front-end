package com.youcode.cuisenio.features.recipe.dto.comment.response;

import lombok.Data;

import java.util.Date;


public record RecipeCommentResponse (
        Long id,
        String content,
        Date createdAt
){}