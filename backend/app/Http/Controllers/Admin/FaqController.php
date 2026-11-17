<?php
namespace App\Http\Controllers\Admin;use App\Models\Faq;class FaqController extends CrudController { protected string $model=Faq::class;protected array $rules=['question'=>'required|string|max:500','answer'=>'required|string','category'=>'nullable|string|max:150','sort_order'=>'nullable|integer|min:0','status'=>'nullable|string|max:50'];protected array $defaults=['status'=>'active']; }
