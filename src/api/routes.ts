export const routes = {
    auth: {
      login: '/v1/auth/login',
      register: '/v1/auth/register',
      refreshToken: '/v1/auth/refresh-token',
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
    recipes: {
      base: '/v1/recipes',
      detail: (id: number) => `/v1/recipes/${id}`,
      comments: (id: number) => `/v1/recipes/${id}/comments`,
    },
    users: {
        base: '/v1/admin/users',
        detail: (id: number) => `/v1/admin/users${id}`,
        count: '/v1/admin/users/count',

      },
    mealPlanner: {
      base: '/v1/meal-planners',
      detail: (id: number) => `/v1/meal-planners/${id}`,
    },
  };