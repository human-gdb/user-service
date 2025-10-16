# Vue.js Frontend - Angular-like Structure

This Vue.js frontend has been organized following Angular's typical structure with services for API calls and components for HTML and TypeScript.

## Project Structure

```
frontend/
├── components/           # Component directory (like Angular components)
│   ├── hello/           # Hello component
│   │   ├── hello.component.ts
│   │   └── hello.component.html
│   ├── users/           # Users component
│   │   ├── users.component.ts
│   │   └── users.component.html
│   ├── search/          # Search component
│   │   ├── search.component.ts
│   │   └── search.component.html
│   └── index.ts         # Component exports
├── services/            # Service directory (like Angular services)
│   ├── hello.service.ts
│   ├── user.service.ts
│   └── search.service.ts
├── models/              # Model directory (like Angular models)
│   ├── user.model.ts
│   ├── search.model.ts
│   ├── hello.model.ts
│   ├── common.model.ts
│   └── index.ts
├── app.ts              # Main application file
├── index.html          # Main HTML template
├── style.css           # Global styles
└── tsconfig.json       # TypeScript configuration
```

## Architecture

### Services
- **Purpose**: Handle all API communication and business logic
- **Location**: `services/` directory
- **Pattern**: Each service is a class with methods for specific API endpoints
- **Examples**:
  - `UserService`: Handles user CRUD operations
  - `SearchService`: Handles fairy tale search functionality
  - `HelloService`: Handles hello API calls

### Components
- **Purpose**: Handle UI logic and presentation
- **Location**: `components/` directory
- **Pattern**: Each component has separate `.ts` and `.html` files
- **Structure**:
  - `component.ts`: Contains component logic, data, and methods
  - `component.html`: Contains component template
- **Examples**:
  - `HelloComponent`: Manages hello API display
  - `UsersComponent`: Manages user list and form
  - `SearchComponent`: Manages search functionality

### Models
- **Purpose**: Define TypeScript interfaces and types
- **Location**: `models/` directory
- **Pattern**: Separate files for different domain models
- **Examples**:
  - `User`: User data structure
  - `SearchResult`: Search result structure
  - `HelloResponse`: Hello API response structure

## Key Benefits

1. **Separation of Concerns**: API logic is separated from UI logic
2. **Reusability**: Services can be reused across components
3. **Maintainability**: Clear structure makes code easier to maintain
4. **Testability**: Services and components can be tested independently
5. **Scalability**: Easy to add new features following the same pattern

## Usage

### Adding a New Feature

1. **Create Models**: Define interfaces in `models/`
2. **Create Service**: Add API logic in `services/`
3. **Create Component**: Add UI logic in `components/`
4. **Update Main App**: Wire everything together in `app.ts`

### Example: Adding a New API

```typescript
// 1. Create model
// models/product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

// 2. Create service
// services/product.service.ts
import { Product } from '../models/product.model';

export class ProductService {
  async getProducts(): Promise<Product[]> {
    // API logic here
  }
}

// 3. Create component
// components/products/products.component.ts
import { ProductService } from '../../services/product.service';

export class ProductsComponent {
  private productService: ProductService;
  public products: Product[] = [];

  constructor() {
    this.productService = new ProductService();
  }

  async fetchProducts(): Promise<void> {
    this.products = await this.productService.getProducts();
  }
}
```

This structure provides a clean, maintainable, and scalable foundation for the Vue.js application while following Angular's organizational patterns.
