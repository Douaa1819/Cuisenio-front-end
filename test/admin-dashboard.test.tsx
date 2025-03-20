// import * as React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import { BrowserRouter } from 'react-router-dom';
// import AdminDashboard from '../src/pages/dashboard/AdminDashboard';
// import { ingredientService } from '../src/api/ingredient.service';
// import { categoryService } from '../src/api/category.service';
// import { userService } from '../src/api/user.service';
// import { authService } from '../src/api/auth.service';

// // Mock des services
// jest.mock('../src/api/ingredient.service');
// jest.mock('../src/api/category.service');
// jest.mock('../src/api/user.service');
// jest.mock('../src/api/auth.service');

// // Mock de useNavigate
// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate
// }));

// describe('AdminDashboard Component', () => {
//   beforeEach(() => {
//     // Configuration des mocks avant chaque test
//     (ingredientService.findAll as jest.Mock).mockResolvedValue({ content: [
//       { id: 1, name: 'Flour' },
//       { id: 2, name: 'Sugar' }
//     ]});
//     (ingredientService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
    
//     (categoryService.findAll as jest.Mock).mockResolvedValue({ content: [
//       { id: 1, name: 'Baking' },
//       { id: 2, name: 'Spices' }
//     ]});
//     (categoryService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
    
//     (userService.listUser as jest.Mock).mockResolvedValue({ content: [
//       { id: 1, username: 'user1', lastName: 'Test', email: 'user1@test.com', registrationDate: '2023-01-01', isblocked: false },
//       { id: 2, username: 'user2', lastName: 'Test', email: 'user2@test.com', registrationDate: '2023-01-02', isblocked: true }
//     ]});
//     (userService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders dashboard with correct sections', async () => {
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Vérifier que le titre du dashboard est affiché
//     expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    
//     // Vérifier que les statistiques sont affichées
//     await waitFor(() => {
//       expect(screen.getByText('Total Ingredients')).toBeInTheDocument();
//       expect(screen.getByText('2')).toBeInTheDocument(); // Le nombre d'ingrédients
//     });
//   });

//   test('can navigate between sections', async () => {
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Cliquer sur le bouton Ingredients dans la sidebar
//     fireEvent.click(screen.getByText('Ingredients'));
    
//     // Vérifier que le titre change
//     await waitFor(() => {
//       expect(screen.getByText('Ingredient Management')).toBeInTheDocument();
//     });
    
//     // Cliquer sur le bouton Categories
//     fireEvent.click(screen.getByText('Categories'));
    
//     // Vérifier que le titre change
//     await waitFor(() => {
//       expect(screen.getByText('Category Management')).toBeInTheDocument();
//     });
//   });

//   test('can add a new ingredient', async () => {
//     // Mock de la fonction create
//     (ingredientService.create as jest.Mock).mockResolvedValue({});
    
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Cliquer sur le bouton Add
//     const addButtons = await screen.findAllByText('Add');
//     fireEvent.click(addButtons[0]);
    
//     // Vérifier que le modal est affiché
//     expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
    
//     // Remplir le formulaire
//     fireEvent.change(screen.getByPlaceholderText('E.g., Flour, Sugar, etc.'), {
//       target: { value: 'Salt' }
//     });
    
//     // Soumettre le formulaire
//     const addButton = screen.getByText('Add').closest('button');
//     if (addButton) {
//       fireEvent.click(addButton);
//     }
    
//     // Vérifier que le service a été appelé
//     await waitFor(() => {
//       expect(ingredientService.create).toHaveBeenCalledWith({ name: 'Salt' });
//     });
//   });

//   test('can delete an ingredient', async () => {
//     // Mock de la fonction delete
//     (ingredientService.delete as jest.Mock).mockResolvedValue({});
    
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Attendre que les ingrédients soient chargés
//     await waitFor(() => {
//       expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
//     });
    
//     // Cliquer sur le bouton Delete du premier ingrédient
//     fireEvent.click(screen.getAllByText('Delete')[0]);
    
//     // Vérifier que le service a été appelé
//     await waitFor(() => {
//       expect(ingredientService.delete).toHaveBeenCalledWith(1);
//     });
//   });

//   test('can block a user', async () => {
//     // Mock de la fonction blockUser
//     (userService.blockUser as jest.Mock).mockResolvedValue({});
    
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Aller à la section Users
//     fireEvent.click(screen.getByText('Users'));
    
//     // Attendre que les utilisateurs soient chargés
//     await waitFor(() => {
//       expect(screen.getByText('user1@test.com')).toBeInTheDocument();
//     });
    
//     // Trouver et cliquer sur le bouton Block
//     const blockButton = screen.getByText('Block').closest('button');
//     if (blockButton) {
//       fireEvent.click(blockButton);
//     }
    
//     // Vérifier que le service a été appelé
//     await waitFor(() => {
//       expect(userService.blockUser).toHaveBeenCalledWith(1);
//     });
//   });

//   test('logout redirects to login page', async () => {
//     // Mock de la fonction logout
//     (authService.logout as jest.Mock).mockResolvedValue({});
    
//     render(
//       <BrowserRouter>
//         <AdminDashboard />
//       </BrowserRouter>
//     );
    
//     // Cliquer sur le bouton Logout
//     fireEvent.click(screen.getByText('Logout'));
    
//     // Vérifier que le service a été appelé
//     await waitFor(() => {
//       expect(authService.logout).toHaveBeenCalled();
//     });
    
//     // Vérifier que la redirection a été appelée après le délai
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/login');
//     }, { timeout: 3000 });
//   });
// });