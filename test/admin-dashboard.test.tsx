import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../src/pages/dashboard/AdminDashboard';
import { ingredientService } from '../src/api/ingredient.service';
import { categoryService } from '../src/api/category.service';
import { userService } from '../src/api/user.service';
import { authService } from '../src/api/auth.service';

jest.mock('../src/api/ingredient.service');
jest.mock('../src/api/category.service');
jest.mock('../src/api/user.service');
jest.mock('../src/api/auth.service');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    (ingredientService.findAll as jest.Mock).mockResolvedValue({ content: [
      { id: 1, name: 'Flour' },
      { id: 2, name: 'Sugar' }
    ]});
    (ingredientService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
    
    (categoryService.findAll as jest.Mock).mockResolvedValue({ content: [
      { id: 1, name: 'Baking' },
      { id: 2, name: 'Spices' }
    ]});
    (categoryService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
    
    (userService.listUser as jest.Mock).mockResolvedValue({ content: [
      { id: 1, username: 'user1', lastName: 'Test', email: 'user1@test.com', registrationDate: '2023-01-01', isblocked: false },
      { id: 2, username: 'user2', lastName: 'Test', email: 'user2@test.com', registrationDate: '2023-01-02', isblocked: true }
    ]});
    (userService.getCount as jest.Mock).mockResolvedValue({ count: 2 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with correct sections', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Total Ingredients')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); 
    });
  });

  test('can navigate between sections', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Ingredients'));
    
    await waitFor(() => {
      expect(screen.getByText('Ingredient Management')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Categories'));
    
    await waitFor(() => {
      expect(screen.getByText('Category Management')).toBeInTheDocument();
    });
  });

  test('can add a new ingredient', async () => {
    (ingredientService.create as jest.Mock).mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    const addButtons = await screen.findAllByText('Add');
    fireEvent.click(addButtons[0]);
    
    expect(screen.getByText('Add Ingredient')).toBeInTheDocument();
    
    fireEvent.change(screen.getByPlaceholderText('E.g., Flour, Sugar, etc.'), {
      target: { value: 'Salt' }
    });
    
    const addButton = screen.getByText('Add').closest('button');
    if (addButton) {
      fireEvent.click(addButton);
    }
    
    await waitFor(() => {
      expect(ingredientService.create).toHaveBeenCalledWith({ name: 'Salt' });
    });
  });

  test('can delete an ingredient', async () => {
    (ingredientService.delete as jest.Mock).mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getAllByText('Delete')[0]);
    
    await waitFor(() => {
      expect(ingredientService.delete).toHaveBeenCalledWith(1);
    });
  });

  test('can block a user', async () => {
    (userService.blockUser as jest.Mock).mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Users'));
    
    await waitFor(() => {
      expect(screen.getByText('user1@test.com')).toBeInTheDocument();
    });
    
    const blockButton = screen.getByText('Block').closest('button');
    if (blockButton) {
      fireEvent.click(blockButton);
    }
    
    await waitFor(() => {
      expect(userService.blockUser).toHaveBeenCalledWith(1);
    });
  });

  test('logout redirects to login page', async () => {
    (authService.logout as jest.Mock).mockResolvedValue({});
    
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });
})