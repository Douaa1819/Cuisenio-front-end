package com.youcode.cuisenio.features.recipe.mapper;


import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.recipe.dto.comment.request.RecipeCommentRequest;
import com.youcode.cuisenio.features.recipe.dto.comment.response.RecipeCommentResponse;
import com.youcode.cuisenio.features.recipe.entity.RecipeComment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RecipeCommentMapper extends BaseMapper<RecipeComment, RecipeCommentRequest, RecipeCommentResponse> {
}
