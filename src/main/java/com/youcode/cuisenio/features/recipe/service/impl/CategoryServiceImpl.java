package com.youcode.cuisenio.features.recipe.service.impl;

import com.youcode.cuisenio.features.recipe.dto.category.request.CategoryRequest;
import com.youcode.cuisenio.features.recipe.dto.category.response.CategoryResponse;
import com.youcode.cuisenio.features.recipe.entity.Category;
import com.youcode.cuisenio.features.recipe.exception.CategoryNotFoundException;
import com.youcode.cuisenio.features.recipe.mapper.CategoryMapper;
import com.youcode.cuisenio.features.recipe.repository.CategoryRepository;
import com.youcode.cuisenio.features.recipe.service.CategoryService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }
    @Override
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(categoryMapper::toResponse);
    }


    @Override
    public CategoryResponse findById(Long id) {
        return categoryRepository.findById(id).map(categoryMapper::toResponse).orElseThrow(()
        ->new CategoryNotFoundException("Category Not Found avec id"+id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public CategoryResponse create(CategoryRequest request) {
        Category category = categoryMapper.toEntity(request);
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(()->new CategoryNotFoundException("Category Not Found avec id"+id));
        category.setName(request.name());
        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public void delete(Long id) {
        if(!categoryRepository.existsById(id)) {
           throw new CategoryNotFoundException("Category Not Found avec id"+id);
        }
        categoryRepository.deleteById(id);
    }
}
