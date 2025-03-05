package com.youcode.cuisenio.features.recipe.service;

import com.youcode.cuisenio.common.service.CrudService;
import com.youcode.cuisenio.features.recipe.dto.category.request.CategoryRequest;
import com.youcode.cuisenio.features.recipe.dto.category.response.CategoryResponse;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

@Service
@Transactional
public interface CategoryService extends CrudService<Long, CategoryRequest, CategoryResponse> {
}
