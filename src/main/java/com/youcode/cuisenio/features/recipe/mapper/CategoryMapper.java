package com.youcode.cuisenio.features.recipe.mapper;

import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.recipe.dto.category.request.CategoryRequest;
import com.youcode.cuisenio.features.recipe.dto.category.response.CategoryResponse;
import com.youcode.cuisenio.features.recipe.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper extends BaseMapper<Category, CategoryRequest, CategoryResponse> {}


