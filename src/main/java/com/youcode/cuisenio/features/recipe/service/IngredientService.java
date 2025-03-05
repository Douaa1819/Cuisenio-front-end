package com.youcode.cuisenio.features.recipe.service;
import com.youcode.cuisenio.common.service.CrudService;
import com.youcode.cuisenio.features.recipe.dto.ingredient.request.IngredientRequest;
import com.youcode.cuisenio.features.recipe.dto.ingredient.response.IngredientResponse;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public interface IngredientService  extends CrudService<Long, IngredientRequest, IngredientResponse> {

}
