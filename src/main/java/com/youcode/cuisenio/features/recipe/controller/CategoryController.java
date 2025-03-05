package com.youcode.cuisenio.features.recipe.controller;
import com.youcode.cuisenio.features.recipe.dto.category.request.CategoryRequest;
import com.youcode.cuisenio.features.recipe.dto.category.response.CategoryResponse;
import com.youcode.cuisenio.features.recipe.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;
    public CategoryController(final CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody final CategoryRequest categoryRequest) {
        final CategoryResponse categoryResponse = categoryService.create(categoryRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryResponse);
    }
    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> findAll(final Pageable pageable) {
        return ResponseEntity.ok(categoryService.findAll(pageable));
    }
    @GetMapping("/{id}")
    public ResponseEntity <CategoryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity <CategoryResponse> update(@PathVariable Long id, final @RequestBody CategoryRequest categoryRequest) {
        return ResponseEntity.ok(categoryService.update(id, categoryRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity <CategoryResponse> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();

    }
}
