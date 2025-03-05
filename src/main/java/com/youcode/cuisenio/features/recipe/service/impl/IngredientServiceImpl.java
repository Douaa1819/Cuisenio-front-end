package com.youcode.cuisenio.features.recipe.service.impl;

import com.youcode.cuisenio.features.recipe.dto.ingredient.request.IngredientRequest;
import com.youcode.cuisenio.features.recipe.dto.ingredient.response.IngredientResponse;
import com.youcode.cuisenio.features.recipe.entity.Ingredient;
import com.youcode.cuisenio.features.recipe.exception.IngredientNotFoundException;
import com.youcode.cuisenio.features.recipe.mapper.IngredientMapper;
import com.youcode.cuisenio.features.recipe.repository.IngredientRepository;
import com.youcode.cuisenio.features.recipe.service.IngredientService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class IngredientServiceImpl  implements IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;

    public IngredientServiceImpl(IngredientRepository ingredientRepository, IngredientMapper ingredientMapper) {
        this.ingredientRepository = ingredientRepository;
        this.ingredientMapper = ingredientMapper;
    }

    public Page<IngredientResponse> findAll(Pageable pageable) {
        return ingredientRepository.findAll(pageable)
                .map(ingredientMapper::toResponse);
    }

    public IngredientResponse findById(Long id) {
        return ingredientRepository.findById(id)
                .map(ingredientMapper::toResponse)
                .orElseThrow(() -> new IngredientNotFoundException("Ingrédient non trouvé avec l'id: " + id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public IngredientResponse create(IngredientRequest request) {
        Ingredient ingredient = ingredientMapper.toEntity(request);
        ingredient = ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(ingredient);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public IngredientResponse update(Long id, IngredientRequest request) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new IngredientNotFoundException("Ingrédient non trouvé avec l'id: " + id));

        ingredient.setName(request.name());
        ingredient = ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(ingredient);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Long id) {
        if (!ingredientRepository.existsById(id)) {
            throw new IngredientNotFoundException("Ingrédient non trouvé avec l'id: " + id);
        }
        ingredientRepository.deleteById(id);
    }
}
