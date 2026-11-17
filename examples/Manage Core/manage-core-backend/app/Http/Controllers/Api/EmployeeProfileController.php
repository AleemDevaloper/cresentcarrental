<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmployeeProfile;
use Illuminate\Http\Request;

class EmployeeProfileController extends Controller
{
    public function show(User $user)
    {
        $user->load(['profile', 'manager', 'subordinates', 'role_ref', 'departments']);
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            // User fields
            'first_name' => 'string|max:255',
            'last_name' => 'string|max:255',
            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'employee_type' => 'nullable|string',
            'joining_date' => 'nullable|date',
            'probation_end_date' => 'nullable|date',
            'confirmation_date' => 'nullable|date',
            'exit_date' => 'nullable|date',
            'manager_id' => 'nullable|exists:users,id',
            'bank_name' => 'nullable|string',
            'account_number' => 'nullable|string',
            'cnic_passport' => 'nullable|string',
            'emergency_contact_name' => 'nullable|string',
            'emergency_contact_phone' => 'nullable|string',
            'blood_group' => 'nullable|string',
            
            // Profile fields
            'education' => 'nullable|array',
            'experience' => 'nullable|array',
            'skills' => 'nullable|array',
            'certifications' => 'nullable|array',
            'languages' => 'nullable|array',
            'family_details' => 'nullable|array',
        ]);

        $user->update($request->only([
            'first_name', 'last_name', 'gender', 'dob', 'phone', 'address',
            'employee_type', 'joining_date', 'probation_end_date', 'confirmation_date', 'exit_date',
            'manager_id', 'bank_name', 'account_number', 'cnic_passport',
            'emergency_contact_name', 'emergency_contact_phone', 'blood_group'
        ]));

        $user->profile()->updateOrCreate(
            ['user_id' => $user->id],
            $request->only(['education', 'experience', 'skills', 'certifications', 'languages', 'family_details'])
        );

        return response()->json($user->load('profile'));
    }
}
