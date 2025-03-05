package com.youcode.cuisenio.features.recipe.service.impl;

import com.youcode.cuisenio.features.auth.entity.User;
import com.youcode.cuisenio.features.auth.service.UserService;
import com.youcode.cuisenio.features.recipe.dto.comment.request.RecipeCommentRequest;
import com.youcode.cuisenio.features.recipe.dto.comment.response.RecipeCommentResponse;
import com.youcode.cuisenio.features.recipe.entity.Recipe;
import com.youcode.cuisenio.features.recipe.entity.RecipeComment;
import com.youcode.cuisenio.features.recipe.exception.RecipeNotFoundException;
import com.youcode.cuisenio.features.recipe.mapper.RecipeCommentMapper;
import com.youcode.cuisenio.features.recipe.repository.RecipeCommentRepository;
import com.youcode.cuisenio.features.recipe.repository.RecipeRepository;
import com.youcode.cuisenio.features.recipe.service.RecipeCommentService;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RecipeCommentServiceImpl implements RecipeCommentService {

    private final RecipeCommentRepository recipeCommentRepository;
    private final RecipeRepository recipeRepository;
    private final UserService userService;
    private final RecipeCommentMapper recipeCommentMapper;

    public RecipeCommentServiceImpl(RecipeCommentRepository recipeCommentRepository,
                                    RecipeRepository recipeRepository,
                                    UserService userService,
                                    RecipeCommentMapper recipeCommentMapper) {
        this.recipeCommentRepository = recipeCommentRepository;
        this.recipeRepository = recipeRepository;
        this.userService = userService;
        this.recipeCommentMapper = recipeCommentMapper;
    }

    public RecipeCommentResponse create(Long recipeId, RecipeCommentRequest request, String email) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + recipeId));

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RecipeComment comment = recipeCommentMapper.toEntity(request);
        comment.setRecipe(recipe);
        comment.setUser(user);
        comment.setCreatedAt(new Date());

        comment = recipeCommentRepository.save(comment);

        return recipeCommentMapper.toResponse(comment);
    }

    public List<RecipeCommentResponse> getCommentsByRecipeId(Long recipeId) {
        List<RecipeComment> comments = recipeCommentRepository.findByRecipeId(recipeId);

        return comments.stream()
                .map(recipeCommentMapper::toResponse)
                .collect(Collectors.toList());
    }

    public RecipeCommentResponse approveComment(Long commentId, boolean isApproved) {
        RecipeComment comment = recipeCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment = recipeCommentRepository.save(comment);

        return recipeCommentMapper.toResponse(comment);
    }


    @Override
    public Page<RecipeCommentResponse> findAll(Pageable pageable) {
        return null;
    }

    @Override
    public RecipeCommentResponse findById(Long aLong) {
        return null;
    }

    @Override
    public RecipeCommentResponse create(RecipeCommentRequest recipeCommentRequest) {
        return null;
    }

    @Override
    public RecipeCommentResponse update(Long aLong, RecipeCommentRequest recipeCommentRequest) {
        return null;
    }

    @Override
    public void delete(Long aLong) {

    }
}