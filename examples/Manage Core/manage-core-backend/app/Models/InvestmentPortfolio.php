<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestmentPortfolio extends Model
{
    protected $fillable = ['name', 'description'];

    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class, 'portfolio_id');
    }
}
