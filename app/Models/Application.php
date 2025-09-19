<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Application extends Model
{
  use HasFactory, Notifiable;
  protected $fillable = [
    'first_name',
    'middle_name',
    'last_name',
    'email',
    'phone_number',
    'address',
    'zipCode',
    'city',
    'state',
    'gender',
    'dob',
    'income',
    'ssn',
    'bank_name',
    'has_cards',
    'no_of_cards',
    'card_limit',
    'id_front',
    'id_back',
    'reference',
    'grantSelect',
    'grantDescription',
    'status',
    'amount_applied',
    'amount_approved'
  ];
}
