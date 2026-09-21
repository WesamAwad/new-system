<?php

namespace App\Http\Requests\Auth;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'city' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in([UserRole::Customer->value, UserRole::Technician->value])],
            'terms' => ['accepted'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $role = $this->input('role');

        if ($role === 'client') {
            $this->merge(['role' => UserRole::Customer->value]);
        }

        if ($this->filled('phone')) {
            $this->merge([
                'phone' => trim((string) $this->input('phone')),
            ]);
        }
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'terms.accepted' => 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.',
            'role.in' => 'نوع الحساب يجب أن يكون عميل أو فني صيانة.',
        ];
    }
}
