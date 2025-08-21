# Assista-Demo: CRUD Operations and Foreign Key Relationships Documentation

## Table of Contents
1. [Database Schema and Foreign Key Relationships](#database-schema-and-foreign-key-relationships)
2. [CRUD Operations Pattern](#crud-operations-pattern)
3. [Foreign Key Implementation](#foreign-key-implementation)
4. [File Upload Handling](#file-upload-handling)
5. [Soft Delete Implementation](#soft-delete-implementation)

## Database Schema and Foreign Key Relationships

### Entity Relationship Overview

The Assista-demo system manages crisis assistance applications with the following main entities:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Gender    │    │   Crisis    │    │  Situation  │
│             │    │             │    │             │
│ gender_id   │    │ crisis_id   │    │situation_id │
│ gender      │    │ crisis      │    │ situation   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   Applicant     │
                  │                 │
                  │ applicant_id    │
                  │ gender_id (FK)  │
                  │ crisis_id (FK)  │
                  │ situation_id(FK)│
                  │ personal_info   │
                  │ contact_info    │
                  │ attached_file   │
                  └─────────────────┘
                           │
                           │
                  ┌─────────────────┐
                  │  Application    │
                  │                 │
                  │application_id   │
                  │ gender_id (FK)  │
                  │ crisis_id (FK)  │
                  │ situation_id(FK)│
                  │ personal_info   │
                  │ contact_info    │
                  │ attached_file   │
                  └─────────────────┘
```

### Foreign Key Relationships

#### 1. **Applicant Model Relationships**
```php
// Many-to-One relationships
public function gender(): BelongsTo
{
    return $this->belongsTo(Gender::class, 'gender_id', 'gender_id');
}

public function crisis(): BelongsTo
{
    return $this->belongsTo(Crisis::class, 'crisis_id', 'crisis_id');
}

public function situation(): BelongsTo
{
    return $this->belongsTo(Situation::class, 'situation_id', 'situation_id');
}
```

#### 2. **Reference Table Relationships**
```php
// Gender Model - One-to-Many
public function users(): HasMany
{
    return $this->hasMany(User::class, 'gender_id', 'gender_id');
}

// Crisis Model - One-to-Many
public function users(): HasMany
{
    return $this->hasMany(User::class, 'crisis_id', 'crisis_id');
}

// Situation Model - One-to-Many
public function users(): HasMany
{
    return $this->hasMany(User::class, 'situation_id', 'situation_id');
}
```

#### 3. **Database Constraints**
```php
// Foreign Key Constraints in Migration
$table->foreign('gender_id')
    ->references('gender_id')
    ->on('tbl_genders')
    ->onUpdate('cascade')
    ->onDelete('cascade');

$table->foreign('crisis_id')
    ->references('crisis_id')
    ->on('tbl_crisiss')
    ->onUpdate('cascade')
    ->onDelete('cascade');

$table->foreign('situation_id')
    ->references('situation_id')
    ->on('tbl_situations')
    ->onUpdate('cascade')
    ->onDelete('cascade');
```

## CRUD Operations Pattern

### 1. **CREATE Operations**

#### Backend Implementation (Laravel)
```php
public function storeApplicant(Request $request)
{
    // 1. Validation with foreign key validation
    $validated = $request->validate([
        'first_name' => ['required', 'max:55'],
        'gender' => ['required'], // This is gender_id
        'crisis' => ['required'], // This is crisis_id
        'situation' => ['required'], // This is situation_id
        'gmail' => ['required', 'min:6', 'max:255', Rule::unique('tbl_applicants', 'gmail')],
        // ... other fields
    ]);

    // 2. File handling
    $attachedFileFilenameToStore = null;
    if ($request->hasFile('add_applicant_file')) {
        $filenameWithExtension = $request->file('add_applicant_file');
        $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $filenameWithExtension->getClientOriginalExtension();
        $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
        $filenameWithExtension->storeAs('public/img/applicant/files', $filenameToStore);
        $attachedFileFilenameToStore = $filenameToStore;
    }

    // 3. Business logic (age calculation)
    $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

    // 4. Database insertion with foreign keys
    Applicant::create([
        'gender_id' => $validated['gender'],    // Foreign key
        'crisis_id' => $validated['crisis'],    // Foreign key
        'situation_id' => $validated['situation'], // Foreign key
        'attached_file' => $attachedFileFilenameToStore,
        'age' => $age,
        'is_deleted' => false,
        // ... other fields
    ]);

    return response()->json(['message' => 'Applicant Successfully Saved.'], 200);
}
```

#### Frontend Implementation (React/TypeScript)
```typescript
const storeApplicant = async (data: any) => {
  try {
    const response = await AxiosInstance.post("/applicant/storeApplicant", data, {
      headers: {
        'Content-Type': 'multipart/form-data', // For file uploads
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
```

### 2. **READ Operations**

#### Backend Implementation with Joins
```php
public function loadApplicants(Request $request)
{
    $search = $request->input('search');

    // Join with foreign key tables to get related data
    $applicants = Applicant::with(['gender', 'crisis'])
        ->leftJoin('tbl_genders', 'tbl_applicants.gender_id', '=', 'tbl_genders.gender_id')
        ->leftJoin('tbl_crisiss', 'tbl_applicants.crisis_id', '=', 'tbl_crisiss.crisis_id')
        ->select(
            'tbl_applicants.*',     // All applicant fields
            'tbl_genders.gender',   // Related gender name
            'tbl_crisiss.crisis'    // Related crisis name
        )
        ->where('tbl_applicants.is_deleted', false) // Soft delete filter
        ->orderBy('tbl_applicants.last_name', 'asc');

    // Search functionality across related tables
    if ($search) {
        $applicants->where(function ($applicant) use ($search) {
            $applicant->where('tbl_applicants.first_name', 'like', "%{$search}%")
                ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
                ->orWhere('tbl_crisiss.crisis', 'like', "%{$search}%");
        });
    }

    $applicants = $applicants->paginate(15);

    // Transform data for frontend consumption
    $applicants->getCollection()->transform(function ($applicant) {
        $applicant->attached_file_url = $applicant->attached_file ?
            url('storage/img/applicant/files/' . $applicant->attached_file) : null;
        unset($applicant->attached_file); // Remove raw filename
        return $applicant;
    });

    return response()->json(['applicants' => $applicants], 200);
}
```

### 3. **UPDATE Operations**

#### Backend Implementation
```php
public function updateApplicant(Request $request, Applicant $applicant)
{
    // 1. Validation with unique rule exception for current record
    $validated = $request->validate([
        'gmail' => ['required', 'min:6', 'max:255', 
            Rule::unique('tbl_applicants', 'gmail')
                ->ignore($applicant->applicant_id, 'applicant_id')],
        'gender' => ['required'],
        'crisis' => ['required'],
        'situation' => ['required'],
        // ... other fields
    ]);

    // 2. File handling (update/remove)
    if ($request->has('remove_attached_file') && $request->remove_attached_file == '1') {
        // Remove existing file
        if ($applicant->attached_file && Storage::exists('public/img/applicant/files/' . $applicant->attached_file)) {
            Storage::delete('public/img/applicant/files/' . $applicant->attached_file);
        }
        $validated['attached_file'] = null;
    } elseif ($request->hasFile('edit_applicant_file')) {
        // Replace with new file
        if ($applicant->attached_file && Storage::exists('public/img/applicant/files/' . $applicant->attached_file)) {
            Storage::delete('public/img/applicant/files/' . $applicant->attached_file);
        }
        // ... file processing logic
        $validated['attached_file'] = $filenameToStore;
    } else {
        // Keep existing file
        $validated['attached_file'] = $applicant->attached_file;
    }

    // 3. Update with foreign keys
    $applicant->update([
        'gender_id' => $validated['gender'],
        'crisis_id' => $validated['crisis'],
        'situation_id' => $validated['situation'],
        'attached_file' => $validated['attached_file'],
        // ... other fields
    ]);

    return response()->json([
        'message' => 'Applicant Successfully Updated.',
        'applicant' => $applicant
    ], 200);
}
```

### 4. **DELETE Operations (Soft Delete)**

#### Backend Implementation
```php
public function destroyApplicant(Applicant $applicant)
{
    // Soft delete - set is_deleted flag instead of actual deletion
    $applicant->update([
        'is_deleted' => true
    ]);

    return response()->json([
        'message' => 'Applicant Successfully Deleted.'
    ], 200);
}
```

## Foreign Key Implementation

### 1. **Migration Setup**
```php
// Create foreign key columns
$table->unsignedBigInteger('gender_id');
$table->unsignedBigInteger('crisis_id');
$table->unsignedBigInteger('situation_id');

// Define foreign key constraints
$table->foreign('gender_id')
    ->references('gender_id')
    ->on('tbl_genders')
    ->onUpdate('cascade')
    ->onDelete('cascade');
```

### 2. **Model Relationships**
```php
// Define relationships in models
protected $fillable = [
    'gender_id',    // Foreign key field
    'crisis_id',    // Foreign key field
    'situation_id', // Foreign key field
    // ... other fields
];

// Relationship methods
public function gender(): BelongsTo
{
    return $this->belongsTo(Gender::class, 'gender_id', 'gender_id');
}
```

### 3. **Controller Usage**
```php
// Store foreign key values from request
'gender_id' => $validated['gender'],    // Frontend sends 'gender', stored as 'gender_id'
'crisis_id' => $validated['crisis'],    // Frontend sends 'crisis', stored as 'crisis_id'
'situation_id' => $validated['situation'], // Frontend sends 'situation', stored as 'situation_id'
```

## File Upload Handling

### 1. **File Upload Process**
```php
// 1. Validate file
'add_applicant_file' => ['nullable', 'file', 'mimes:jpeg,pdf', 'max:5120'],

// 2. Process file if exists
if ($request->hasFile('add_applicant_file')) {
    $filenameWithExtension = $request->file('add_applicant_file');
    $filename = pathinfo($filenameWithExtension->getClientOriginalName(), PATHINFO_FILENAME);
    $extension = $filenameWithExtension->getClientOriginalExtension();
    
    // 3. Generate unique filename
    $filenameToStore = sha1('file_' . $filename . time()) . '.' . $extension;
    
    // 4. Store file
    $filenameWithExtension->storeAs('public/img/applicant/files', $filenameToStore);
    $attachedFileFilenameToStore = $filenameToStore;
}

// 5. Store filename in database
'attached_file' => $attachedFileFilenameToStore,
```

### 2. **File URL Generation**
```php
// Transform for frontend consumption
$applicant->attached_file_url = $applicant->attached_file ?
    url('storage/img/applicant/files/' . $applicant->attached_file) : null;
```

## Soft Delete Implementation

### 1. **Database Design**
```php
// Add is_deleted column to tables
$table->boolean('is_deleted')->default(false);
```

### 2. **Filter Implementation**
```php
// Always filter out deleted records in queries
->where('tbl_applicants.is_deleted', false)
```

### 3. **Delete Operation**
```php
// Soft delete instead of hard delete
$applicant->update(['is_deleted' => true]);
```

## Key Benefits of This Architecture

1. **Data Integrity**: Foreign key constraints ensure referential integrity
2. **Performance**: Proper indexing on foreign keys improves query performance
3. **Flexibility**: Soft deletes allow data recovery
4. **Maintainability**: Clear separation of concerns between models, controllers, and services
5. **Security**: Validation at multiple levels (frontend, backend, database)
6. **File Management**: Secure file handling with unique naming and proper storage
