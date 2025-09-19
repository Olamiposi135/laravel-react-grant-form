<?php

namespace App\Http\Custom;

class ValidationMessages
{
    public static function messages(): array
    {
        return [
            'first_name.required' => 'First Name is required.',
            'first_name.min'      => 'First Name must be at least 3 characters.',
            'middle_name.required' => 'Middle Name is required.',
            'middle_name.min'      => 'Middle Name must be at least 2 characters.',
            'last_name.required' => 'Last Name is required.',
            'last_name.min'      => 'Last Name must be at least 2 characters.',
            'email.required' => 'Email Address is required.',
            'email.email'    => 'Please, enter a valid Email address',
            'phone_number.required' => 'Phone Number is required.',
            'address.required' => 'Home Address is required.',
            'address.min'      => 'Home Address must be at least 5 characters.',
            'zipCode.required' => 'Zip Code is required.',
            'zipCode.regex'    => 'Zip Code must be exactly 5 digits.',
            'city.required' => 'City is required.',
            'city.regex'    => 'City must contain only letters, spaces, or hyphens.',
            'state.required' => 'State is required.',
            'state.regex'    => 'State must contain only letters, spaces, or hyphens.',
            'gender.required' => 'Please select your gender.',
            'dob.required'     => 'Please enter your Date of Birth.',
            'dob.date'         => 'Date of Birth must be a valid date.',
            'dob.before'       => 'Date of Birth must be before today.',
            'income.required' => 'Monthly Income is required.',
            'ssn.required' => 'Social Security Number is required.',
            'bank_name.required' => 'Bank Name is required, input NONE if you don\'t have a Bank.',
            'no_of_cards.required_if' => 'Number of Cards is required when YES is choosen.',
            'no_of_cards.integer'     => 'Number of Cards must be a number.',
            'no_of_cards.min'         => 'You must have at least 1 card.',
            'card_limit.required_if' => 'Card Limit is required when YES is choosen.',
            'card_limit.min'         => 'Card Limit must be at least 3 digits.',
            'id_front.required' => 'Front of ID is required.',
            'id_front.file'     => 'Front of ID must be a valid file.',
            'id_front.image'    => 'Front of ID must be an image.',
            'id_front.max'      => 'Front of ID must not exceed 2MB.',
            'id_back.required' => 'Back of ID is required.',
            'id_back.file'     => 'Back of ID must be a valid file.',
            'id_back.image'    => 'Back of ID must be an image.',
            'id_back.max'      => 'Back of ID must not exceed 2MB.',
        ];
    }

    public static function attributes(): array
    {
        return [
            'first_name'    => 'First Name',
            'middle_name'   => 'Middle Name',
            'last_name'     => 'Last Name',
            'email'         => 'Email Address',
            'phone_number'  => 'Phone Number',
            'address'       => 'Home Address',
            'zipCode'       => 'Zip Code',
            'city'          => 'City',
            'state'         => 'State',
            'gender'        => 'Gender',
            'dob'           => 'Date of Birth',
            'income'        => 'Monthly Income',
            'ssn'           => 'Social Security Number',
            'bank_name'     => 'Bank Name',
            'no_of_cards'   => 'Number of Cards',
            'card_limit'    => 'Card Limit',
            'id_front'      => 'Front of ID',
            'id_back'       => 'Back of ID',
        ];
    }
}
