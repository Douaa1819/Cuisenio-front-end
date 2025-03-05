package com.youcode.cuisenio.features.recipe.dto.comment.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;


public record RecipeCommentRequest (
    @NotBlank(message = "Comment content cannot be empty")
    @Size(min = 2, max = 1000, message = "Comment must be between 2 and 1000 characters")
     String content
    ){}
