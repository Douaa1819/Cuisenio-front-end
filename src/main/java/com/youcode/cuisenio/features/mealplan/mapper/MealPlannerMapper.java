package com.youcode.cuisenio.features.mealplan.mapper;

import com.youcode.cuisenio.common.mapper.BaseMapper;
import com.youcode.cuisenio.features.mealplan.dto.request.MealPlannerRequest;
import com.youcode.cuisenio.features.mealplan.dto.response.MealPlannerResponse;
import com.youcode.cuisenio.features.mealplan.entity.MealPlanner;
import org.mapstruct.*;
@Mapper(
        componentModel = "spring",
        uses = {MealPlannerMapperHelper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface MealPlannerMapper extends BaseMapper<MealPlanner, MealPlannerRequest, MealPlannerResponse> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(source = "dayOfWeek", target = "dayOfWeek", qualifiedByName = "mapDayOfWeek")
    @Mapping(source = "mealType", target = "mealType", qualifiedByName = "mapMealType")
    MealPlanner toEntity(MealPlannerRequest request);

    @Override
    @Mapping(source = "dayOfWeek", target = "dayOfWeek", qualifiedByName = "mapDayOfWeekReverse")
    @Mapping(source = "mealType", target = "mealType", qualifiedByName = "mapMealTypeReverse")
    @Mapping(source = "recipe.id", target = "recipeId")
    MealPlannerResponse toResponse(MealPlanner entity);
}
