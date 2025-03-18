export const routes = {
    auth: {
      base: "/v1/auth",
      login: "/v1/auth/login",
      register: "/v1/auth/register",
      verify: "/v1/auth/verify-token",
    },
    categories: {
      base: '/v1/categories',
      detail: (id: number) => `/v1/categories/${id}`,
    },
    ingredients: {
      base: '/v1/ingredients',
      detail: (id: number) => `/v1/ingredients/${id}`,
      count: '/v1/ingredients/count',
    },
    profile: "/v1/profile",

    recipes: {
      base: '/api/recipes',
      detail: (id: number) => `/api/recipes/${id}`,
      comments: (id: number) => `/api/recipes/${id}/comments`,
      unsave: (id: number) => `/api/recipes/${id}/unsave`,
      saved: "/api/recipes/saved",
      search: "/api/recipes/search",
      addImage: (id: number) => `/api/recipes/add-image/${id}`,


    },
    users: {
        base: '/v1/admin/users',
        detail: (id: number) => `/v1/admin/users${id}`,
        count: '/v1/admin/users/count',

      },
    mealPlanner: {
      base: '/v1/meal-plans',
      detail: (id: number) => `/v1/meal-plans/${id}`,
    },
  };