# Assista-Demo: Important Functions Documentation

## Table of Contents
1. [Authentication Functions](#authentication-functions)
2. [CRUD Service Functions](#crud-service-functions)
3. [Context Management Functions](#context-management-functions)
4. [Utility Functions](#utility-functions)
5. [File Handling Functions](#file-handling-functions)
6. [Validation Functions](#validation-functions)
7. [Frontend Hook Functions](#frontend-hook-functions)

## Authentication Functions

### 1. **Backend Authentication (AuthController)**

#### Login Function
```php
public function login(Request $request)
{
    // Purpose: Authenticate user and generate API token
    // Input: gmail, password
    // Output: User data with authentication token
    
    $validated = $request->validate([
        'gmail' => ['required', 'email'],
        'password' => ['required']
    ]);

    // Attempt authentication
    if (Auth::attempt(['gmail' => $validated['gmail'], 'password' => $validated['password']])) {
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }
    
    return response()->json(['message' => 'Invalid credentials'], 401);
}
```

#### Register Function
```php
public function register(Request $request)
{
    // Purpose: Create new user account
    // Input: User registration data
    // Output: Success message or validation errors
    
    $validated = $request->validate([
        'first_name' => ['required', 'max:55'],
        'last_name' => ['required', 'max:55'],
        'gmail' => ['required', 'email', 'unique:tbl_users,gmail'],
        'password' => ['required', 'min:8', 'confirmed'],
        'contact_number' => ['required', 'string', 'max:20'],
    ]);

    User::create([
        'first_name' => $validated['first_name'],
        'last_name' => $validated['last_name'],
        'gmail' => $validated['gmail'],
        'password' => Hash::make($validated['password']),
        'contact_number' => $validated['contact_number'],
        'is_deleted' => false,
    ]);

    return response()->json(['message' => 'User registered successfully'], 201);
}
```

#### Me Function (Get Current User)
```php
public function me(Request $request)
{
    // Purpose: Get authenticated user's information
    // Input: Authenticated request
    // Output: Current user data
    
    return response()->json($request->user(), 200);
}
```

### 2. **Frontend Authentication (AuthContext)**

#### Login Function
```typescript
const login = async (gmail: string, password: string) => {
    // Purpose: Handle user login from frontend
    // Input: User credentials
    // Output: Sets user state and stores token
    
    try {
        const res = await AuthService.login({ gmail, password });

        if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            setUser(res.data);
        } else {
            console.error("Unexpected status error occurred during logging user in: ", res.status);
        }
    } catch (error) {
        console.error("Unexpected server error occurred during logging user in: ", error);
        throw error;
    }
};
```

#### Logout Function
```typescript
const logout = async () => {
    // Purpose: Handle user logout
    // Input: None
    // Output: Clears user state and removes token
    
    try {
        const res = await AuthService.logout();

        if (res.status === 200) {
            localStorage.removeItem("token");
            setUser(null);
        }
    } catch (error) {
        console.error("Unexpected server error occurred during logging user out: ", error);
        throw error;
    } finally {
        localStorage.removeItem("token");
        setUser(null);
    }
};
```

#### Check Authentication Function
```typescript
const checkAuth = async () => {
    // Purpose: Verify if user is still authenticated on app load
    // Input: Token from localStorage
    // Output: Sets user state or clears invalid token
    
    setLoading(true);
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const res = await AuthService.me();

            if (res.status === 200) {
                setUser(res.data);
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        }
        setLoading(false);
    } else {
        setUser(null);
        setLoading(false);
    }
};
```

## CRUD Service Functions

### 1. **ApplicantService Functions**

#### Load Applicants with Search and Pagination
```typescript
loadApplicants: async (page: number, search: string = '') => {
    // Purpose: Fetch paginated list of applicants with optional search
    // Input: page number, search term
    // Output: Paginated applicant data with related information
    
    try {
        const response = await AxiosInstance.get(search
            ? `/applicant/loadApplicants?page=${page}&search=${search}`
            : `/applicant/loadApplicants?page=${page}`);
        return response;
    } catch (error) {
        throw error;
    }
}
```

#### Store Applicant with File Upload
```typescript
storeApplicant: async (data: any) => {
    // Purpose: Create new applicant record with file upload support
    // Input: FormData containing applicant information and files
    // Output: Success response or error
    
    try {
        const response = await AxiosInstance.post("/applicant/storeApplicant", data, {
            headers: {
                'Content-Type': 'multipart/form-data', // Essential for file uploads
            },
        });
        return response;
    } catch (error) {
        throw error;
    }
}
```

#### Update Applicant
```typescript
updateApplicant: async (applicantId: string | number, data: any) => {
    // Purpose: Update existing applicant record
    // Input: applicant ID and updated data
    // Output: Success response with updated data
    
    try {
        const response = await AxiosInstance.post(
            `/applicant/updateApplicant/${applicantId}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
}
```

### 2. **Backend Load Function with Joins**

```php
public function loadApplicants(Request $request)
{
    // Purpose: Load applicants with related data and search functionality
    // Features: Joins, search, pagination, soft delete filtering
    
    $search = $request->input('search');

    $applicants = Applicant::with(['gender', 'crisis'])
        ->leftJoin('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
        ->leftJoin('tbl_crisiss', 'tbl_applicants.crisis_id', '=', 'tbl_crisiss.crisis_id')
        ->select(
            'tbl_applicants.*',
            'tbl_genders.gender',
            'tbl_crisiss.crisis'
        )
        ->where('tbl_applicants.is_deleted', false)
        ->orderBy('tbl_applicants.last_name', 'asc');

    // Multi-table search functionality
    if ($search) {
        $applicants->where(function ($applicant) use ($search) {
            $applicant->where('tbl_applicants.first_name', 'like', "%{$search}%")
                ->orWhere('tbl_applicants.middle_name', 'like', "%{$search}%")
                ->orWhere('tbl_applicants.last_name', 'like', "%{$search}%")
                ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
                ->orWhere('tbl_crisiss.crisis', 'like', "%{$search}%");
        });
    }

    $applicants = $applicants->paginate(15);

    // Transform data for frontend consumption
    $applicants->getCollection()->transform(function ($applicant) {
        $applicant->attached_file_url = $applicant->attached_file ?
            url('storage/img/applicant/files/' . $applicant->attached_file) : null;
        unset($applicant->attached_file);
        return $applicant;
    });

    return response()->json(['applicants' => $applicants], 200);
}
```

## Context Management Functions

### 1. **AuthContext Functions**

#### Update User Function
```typescript
const updateUser = (userData: UserDetails) => {
    // Purpose: Update user data in context without API call
    // Input: Updated user data
    // Output: Updates global user state
    
    setUser(userData);
};
```

### 2. **Custom Hook for Authentication**

```typescript
export const useAuth = () => {
    // Purpose: Provide authentication context to components
    // Input: None
    // Output: Authentication context with user, loading, login, logout functions
    
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
```

## Utility Functions

### 1. **Age Calculation Function**

```php
// Backend age calculation
$age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;
```

### 2. **File Name Generation Function**

```php
// Generate unique filename for uploaded files
$filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
$extension = $filenameWithExtension->getClientOriginalExtension();
$filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
```

### 3. **URL Generation Function**

```php
// Generate full URL for file access
$applicant->attached_file_url = $applicant->attached_file ?
    url('storage/img/applicant/files/' . $applicant->attached_file) : null;
```

## File Handling Functions

### 1. **File Upload Function**

```php
public function handleFileUpload($request, $fieldName, $storagePath)
{
    // Purpose: Generic file upload handler
    // Input: Request object, field name, storage path
    // Output: Stored filename or null
    
    if ($request->hasFile($fieldName)) {
        $filenameWithExtension = $request->file($fieldName);
        $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $filenameWithExtension->getClientOriginalExtension();
        $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
        $filenameWithExtension->storeAs($storagePath, $filenameToStore);
        return $filenameToStore;
    }
    return null;
}
```

### 2. **File Deletion Function**

```php
public function deleteFile($filename, $storagePath)
{
    // Purpose: Delete file from storage
    // Input: Filename and storage path
    // Output: Boolean success/failure
    
    if ($filename && Storage::exists($storagePath . '/' . $filename)) {
        return Storage::delete($storagePath . '/' . $filename);
    }
    return false;
}
```

## Validation Functions

### 1. **Backend Validation Rules**

```php
// Comprehensive validation for applicant data
$validated = $request->validate([
    // Personal Details
    'first_name' => ['required', 'max:55'],
    'middle_name' => ['nullable', 'max:55'],
    'last_name' => ['required', 'max:55'],
    'suffix_name' => ['nullable', 'max:55'],
    'birth_date' => ['required', 'date'],
    'gender' => ['required'],

    // Contact Information
    'contact_number' => ['required', 'string', 'max:20'],
    'gmail' => ['required', 'min:6', 'max:255', Rule::unique('tbl_applicants', 'gmail')],
    'house_no' => ['required', 'string', 'max:100'],
    'street' => ['required', 'string', 'max:100'],
    'subdivision' => ['nullable', 'string', 'max:100'],
    'barangay' => ['required', 'string', 'max:100'],
    'city' => ['required', 'string', 'max:100'],

    // Crisis Details
    'crisis' => ['required'],
    'situation' => ['required'],

    // File Upload
    'add_applicant_file' => ['nullable', 'file', 'mimes:jpeg,pdf', 'max:5120'],
]);
```

### 2. **Unique Validation with Exception**

```php
// Validation for updates - ignore current record
'gmail' => ['required', 'min:6', 'max:255', 
    Rule::unique('tbl_applicants', 'gmail')
        ->ignore($applicant->applicant_id, 'applicant_id')],
```

## Frontend Hook Functions

### 1. **Custom Modal Hook**

```typescript
// useModal.ts - Custom hook for modal management
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const toggleModal = () => setIsOpen(!isOpen);

    return {
        isOpen,
        openModal,
        closeModal,
        toggleModal,
    };
};
```

### 2. **Custom Toast Message Hook**

```typescript
// useToastMessage.ts - Custom hook for toast notifications
export const useToastMessage = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'info'>('info');
    const [isVisible, setIsVisible] = useState(false);

    const showToast = (msg: string, toastType: 'success' | 'error' | 'info' = 'info') => {
        setMessage(msg);
        setType(toastType);
        setIsVisible(true);
        
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    return {
        message,
        type,
        isVisible,
        showToast,
    };
};
```

## Database Query Functions

### 1. **Complex Query with Multiple Joins**

```php
// Load data with multiple relationships
$applicants = Applicant::with(['gender', 'crisis', 'situation'])
    ->leftJoin('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
    ->leftJoin('tbl_crisiss', 'tbl_applicants.crisis_id', '=', 'tbl_crisiss.crisis_id')
    ->leftJoin('tbl_situations', 'tbl_applicants.situation_id', '=', 'tbl_situations.situation_id')
    ->select(
        'tbl_applicants.*',
        'tbl_genders.gender',
        'tbl_crisiss.crisis',
        'tbl_situations.situation'
    )
    ->where('tbl_applicants.is_deleted', false)
    ->orderBy('tbl_applicants.created_at', 'desc')
    ->paginate(15);
```

### 2. **Search Function Across Multiple Tables**

```php
// Multi-table search functionality
if ($search) {
    $query->where(function ($q) use ($search) {
        $q->where('tbl_applicants.first_name', 'like', "%{$search}%")
          ->orWhere('tbl_applicants.last_name', 'like', "%{$search}%")
          ->orWhere('tbl_applicants.gmail', 'like', "%{$search}%")
          ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
          ->orWhere('tbl_crisiss.crisis', 'like', "%{$search}%")
          ->orWhere('tbl_situations.situation', 'like', "%{$search}%");
    });
}
```

## API Response Functions

### 1. **Standardized Success Response**

```php
public function successResponse($data, $message = 'Success', $code = 200)
{
    return response()->json([
        'success' => true,
        'message' => $message,
        'data' => $data
    ], $code);
}
```

### 2. **Standardized Error Response**

```php
public function errorResponse($message = 'Error', $code = 400, $errors = null)
{
    $response = [
        'success' => false,
        'message' => $message
    ];
    
    if ($errors) {
        $response['errors'] = $errors;
    }
    
    return response()->json($response, $code);
}
```

## Key Benefits of These Functions

1. **Modularity**: Functions are well-separated and reusable
2. **Error Handling**: Comprehensive try-catch blocks and validation
3. **Security**: Input validation, file type restrictions, SQL injection prevention
4. **Performance**: Efficient queries with proper joins and pagination
5. **User Experience**: Loading states, error messages, and success feedback
6. **Maintainability**: Clear function names and consistent patterns
7. **Scalability**: Generic functions that can be extended for new features

These functions form the backbone of the Assista-demo application, providing robust CRUD operations, secure authentication, efficient file handling, and excellent user experience through proper state management and error handling.
