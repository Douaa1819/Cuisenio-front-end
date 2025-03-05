package com.youcode.cuisenio.features.recipe.service;

import com.youcode.cuisenio.common.service.CrudService;
import com.youcode.cuisenio.features.recipe.dto.comment.request.RecipeCommentRequest;
import com.youcode.cuisenio.features.recipe.dto.comment.response.RecipeCommentResponse;


public interface RecipeCommentService  extends CrudService<Long, RecipeCommentRequest, RecipeCommentResponse> {
}
